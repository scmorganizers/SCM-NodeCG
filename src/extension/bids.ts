import type { Bids } from '@src/types/schemas';
import { getNodeCG as nodecg } from './util/nodecg';
import deepEqual from 'deep-equal';
import numeral from 'numeral';
import requestPromise from 'request-promise';
import Bluebird from 'bluebird';
import { EVENT_ID, TRACKER_BASE_URL } from './util/constants';

const POLL_INTERVAL = 20 * 1000;
const BIDS_URL = `${TRACKER_BASE_URL}/api/v2/events/${EVENT_ID}/bids/`;
const CURRENT_BIDS_URL = `${TRACKER_BASE_URL}/api/v2/events/${EVENT_ID}/bids/?state=OPENED`;
const currentBidsRep = nodecg().Replicant<Bids>('currentBids', { defaultValue: [] });

let updateTimeout: NodeJS.Timeout;

// Get latest bid data every POLL_INTERVAL milliseconds
update();

/**
 * Grabs the latest bids from the Tracker.
 * @returns {Promise} - A Q.all promise.
 */
function update() {
	nodecg().sendMessage('bids:updating');
	clearTimeout(updateTimeout);

	const currentPromise = requestPromise({
		uri: CURRENT_BIDS_URL,
		json: true,
	});

	const allPromise = requestPromise({
		uri: BIDS_URL,
		json: true,
	});

	return Bluebird.all([currentPromise, allPromise]).then(([currentBidsJSON, allBidsJSON]) => {
			const currentBids = processRawBids(currentBidsJSON);
			const allBids = processRawBids(allBidsJSON);

			// Bits incentives are always marked as "hidden", so they will never show in "current".
			// We must manually add them to "current".
			allBids.forEach((bid) => {
				const bidAlreadyExistsInCurrentBids = currentBids.find(
					(currentBid) => currentBid.id === bid.id
				);

				if (!bidAlreadyExistsInCurrentBids) {
					currentBids.unshift(bid);
				}
			});

			if (!deepEqual(currentBidsRep.value, currentBids)) {
				currentBidsRep.value = currentBids;
			}
		}).catch((err) => {
			nodecg().log.error('Error updating bids:', err);
		}).finally(() => {
			nodecg().sendMessage('bids:updated');
			updateTimeout = setTimeout(update, POLL_INTERVAL);
		});
}

function processRawBids(rawResponse: any) {
	const bids: any[] = Array.isArray(rawResponse) ? rawResponse : (rawResponse?.results || []);
	const parentBidsById: any[] = [];
	const childBids: any[] = [];
	bids.sort(sortBidsByEarliestEndTime).forEach((bid: any) => {
		const state = (bid.state || '').toLowerCase();
		if (state === 'denied' || state === 'pending') {
			return;
		}

		// If this bid is an option for a donation war, add it to childBids array.
		// Else, add it to the parentBidsById object.
		if (bid.parent) {
			childBids.push(bid);
			return;
		}

		// Format the bid to clean up unneeded cruft.
		const formattedParentBid: any = {
			id: bid.id,
			name: bid.name,
			description: bid.shortdescription || `No shortdescription for bid #${bid.id}`,
			longDescription: bid.description || `No description for bid #${bid.id}`,
			total: '$' + parseFloat((bid.total || 0).toString()),
			rawTotal: parseFloat((bid.total || 0).toString()),
			state: bid.state,
			game: bid.speedrun?.name ?? '',
			category: bid.speedrun?.category ?? '',
			runStartTime: Date.parse(bid.speedrun?.starttime) || 0,
			runEndTime: Date.parse(bid.speedrun?.endtime) || 0,
			public: true,
			allowUserOptions: bid.allowuseroptions
		};

		parentBidsById[bid.id] = formattedParentBid;

		// If this parent bid is not a target, that means it is a donation war that has options.
		// So, we should add an options property that is an empty array, which we will fill in the next step.
		// Else, add the "goal" field to the formattedParentBid.
		if (bid.istarget === false) {
			formattedParentBid.options = [];
			return;
		}

		const goal = bid.goal ? parseFloat(bid.goal.toString()) : 0;
		formattedParentBid.goalMet = (bid.total || 0) >= goal;
		if (formattedParentBid.isBitsChallenge) {
			formattedParentBid.goal = numeral(goal * 100).format('0,0');
			formattedParentBid.rawGoal = parseFloat((goal * 100).toString());
			formattedParentBid.rawTotal = formattedParentBid.rawGoal;
			formattedParentBid.total = numeral(formattedParentBid.rawTotal).format('0,0');
			formattedParentBid.goalMet = formattedParentBid.rawTotal >= formattedParentBid.rawGoal;
			formattedParentBid.state = formattedParentBid.goalMet ? 'CLOSED' : 'OPENED';
		} else {
			formattedParentBid.goal = '$' + goal;
			formattedParentBid.rawGoal = goal;
		}
	});

	// Now that we have a big array of all child bids (i.e., donation war options), we need
	// to assign them to their parents in the parentBidsById object.
	childBids.forEach((bid) => {
		const formattedChildBid = {
			id: bid.id,
			parent: bid.parent,
			name: bid.name,
			description: bid.shortdescription,
			speedrun: bid.speedrun,
			total: '$' + parseFloat((bid.total || 0).toString()),
			rawTotal: parseFloat((bid.total || 0).toString()),
		};

		const parent = parentBidsById[bid.parent];
		if (!parent) {
			nodecg().log.error("Child bid #%d's parent (bid #%s) could not be found. This child bid will be discarded!", bid.id, bid.parent);
			return;
		}

		parent.options.push(formattedChildBid);
	});

	// Ah, but now we have to sort all these child bids by how much they have raised so far!
	// While we're at it, map all the parent bids back onto an array and set their "type".
	let bidsArray = [];
	for (const id in parentBidsById) {
		if (!{}.hasOwnProperty.call(parentBidsById, id)) {
			continue;
		}

		const bid = parentBidsById[id];
		bid.type = (function () {
			if (bid.options) {
				if (bid.options.length === 2) {
					return 'choice-binary';
				}

				return 'choice-many';
			}

			return 'challenge';
		})();

		bidsArray.push(bid);

		if (!bid.options) {
			continue;
		}

		bid.options = bid.options.sort(
			(a: { rawTotal: any }, b: { rawTotal: any }) => {
				const aTotal = a.rawTotal;
				const bTotal = b.rawTotal;
				if (aTotal > bTotal) {
					return -1;
				}

				if (aTotal < bTotal) {
					return 1;
				}

				// a must be equal to b
				return 0;
			}
		);
	}

	// Yes, we need to now sort again.
	bidsArray = bidsArray.sort(sortBidsByEarliestEndTime);
	return bidsArray;
}

function sortBidsByEarliestEndTime(a: any,b: any) {
	const aTime = a.speedrun?.endtime ? Date.parse(a.speedrun.endtime) : (a.runEndTime || 0);
	const bTime = b.speedrun?.endtime ? Date.parse(b.speedrun.endtime) : (b.runEndTime || 0);
	return aTime - bTime;
}

nodecg().listenFor('updateBids', update);
