import needle from 'needle';
import WS from 'ws';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { getNodeCG } from './util/nodecg';
import { donationTotal } from './util/replicants';
import { EVENT_ID, EVENT_SHORT, TRACKER_BASE_URL, TRACKER_WS_URL } from './util/constants';

const nodecg = getNodeCG();

class CustomWS extends WS {
	constructor(url: string | URL, protocols?: string | string[]) {
		super(url, protocols, {
			headers: {
				Origin: TRACKER_BASE_URL,
			},
		});
	}
}

// Get donation total from HTTPS API, backup for the repeater socket server.
async function updateDontationTotalFromAPI(): Promise<void> {
	try {
		let total = 0;
		let url: string | null = `${TRACKER_BASE_URL}/api/v2/events/${EVENT_ID}/donations/?limit=500`;
		while (url) {
			const resp = await needle('get', url);
			if (resp.statusCode !== 200) {
				throw new Error(JSON.stringify(resp.body));
			}

			const results = resp.body.results || [];
			for (const dono of results) {
				if (dono.transactionstate === 'COMPLETED') {
					total += typeof dono.amount === 'string' ? parseFloat(dono.amount) : (dono.amount || 0);
				}
			}

			url = resp.body.next || null;
		}

		if (donationTotal.value !== total) {
			nodecg.log.info(`[tracker] API donation total changed: $${total.toFixed(2)}`);
		}

		donationTotal.value = total;
	} catch (err) {
		nodecg.log.info('[tracker] Issue getting API donation total:', err);
	}
}

const options = {
	WebSocket: CustomWS as any,
	connectionTimeout: 1000,
	maxRetries: 100,
};

const client = new ReconnectingWebSocket(TRACKER_WS_URL, [], options);

client.onerror = function() {
	nodecg.log.error('[tracker] WebSocket Client Connection Error');
};

client.onopen = function() {
	nodecg.log.info('[tracker] WebSocket Client Connected');
};

client.onclose = function() {
	nodecg.log.info('[tracker] WebSocket Client Closed');
};

var last_donation_id = 0;

client.onmessage = function(e) {
	try {
		let evt: DonoEvt = JSON.parse(e.data.toString());
		if (!evt || !evt.donation) {
			return;
		}

		// Filter out donations that do not belong to the target event
		if (evt.donation.event && evt.donation.event !== EVENT_ID && evt.donation.event !== EVENT_SHORT) {
			return;
		}

		if (evt.event && evt.event !== EVENT_ID && evt.event !== EVENT_SHORT) {
			return;
		}

		nodecg.log.info(`[tracker] Donation event received: [${evt.donation.id}] ${evt.donation.donor_name} - $${evt.donation.amount} (${evt.donation.readstate})`);

		// Exit early in case we receive an event with dono that hasn't been completed
		if (evt.donation.transactionstate !== "COMPLETED") {
			return;
		}

		// Check if we have latest donation
		if (evt.donation.id > last_donation_id) {
			last_donation_id = evt.donation.id;
			// If the latest donation has a new total, update the UI
			if (evt.event_total && evt.event_total > 0) {
				donationTotal.value = evt.event_total;
				nodecg.log.info(
					`[tracker] Updated donation total received: $${evt.event_total.toFixed(2)}`
				);
			} else {
				updateDontationTotalFromAPI();
			}
		}

		// Show comment on the stream
		if (evt.donation.readstate === "READ")  {
			nodecg.sendMessage('newDonation', {
				donor_name: evt.donation.donor_name,
				amount: evt.donation.amount.toString(),
				comment: evt.donation.comment,
			});
		}
	} catch (err) {
		nodecg.log.error('[tracker] Error processing WebSocket message:', err);
	}
};

interface Dono {
	id: number;
	amount: number;
	currency: string;
	comment: string;
	donor_name: string;
	transactionstate: string;
	readstate: string;
	commentstate: string;
	event?: number | string;
}

interface DonoEvt {
	donation: Dono;
	event_total?: number;
	event?: number | string;
}

// Getting the initial donation total on startup.
updateDontationTotalFromAPI();
setInterval(updateDontationTotalFromAPI, 60000); // Also do this every 60s as a socket fallback.
