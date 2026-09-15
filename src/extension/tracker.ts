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

// This matches the tracker's actual broadcast payload from
// tracker.eventutil.post_donation_to_postbacks (flat, not nested under a
// "donation" key). The tracker only ever broadcasts donations that are
// already completed and already screened/read, so there is no
// transactionstate/readstate field to check here — the message arriving
// at all is the signal.
interface Dono {
	id: number;
	event: number | string;
	amount: number;
	currency: string;
	comment: string;
	donor__visiblename?: string;
	donor__visibility: string;
	new_total: number;
	domain: string;
	bids: unknown[];
}

client.onmessage = function(e) {
	try {
		const dono: Dono = JSON.parse(e.data.toString());
		if (!dono || dono.id == null) {
			return;
		}

		// Filter out donations that do not belong to the target event
		if (dono.event !== EVENT_ID && dono.event !== EVENT_SHORT) {
			return;
		}

		const displayName =
			dono.donor__visibility === 'ANON' ? 'Anonymous' : (dono.donor__visiblename ?? 'Anonymous');

		nodecg.log.info(
			`[tracker] Donation event received: [${dono.id}] ${displayName} - $${dono.amount}`
		);

		// Check if we have latest donation
		if (dono.id > last_donation_id) {
			last_donation_id = dono.id;
			// If the latest donation has a new total, update the UI
			if (dono.new_total > 0) {
				donationTotal.value = dono.new_total;
				nodecg.log.info(`[tracker] Updated donation total received: $${dono.new_total.toFixed(2)}`);
			} else {
				updateDontationTotalFromAPI();
			}
		}

		// Show comment on the stream — every broadcast message is already
		// completed and screened, so this always fires (unlike the old
		// readstate check, which referenced a field that doesn't exist on
		// this payload and would never have been true).
		nodecg.sendMessage('newDonation', {
			donor_name: displayName,
			amount: dono.amount.toString(),
			comment: dono.comment,
		});
	} catch (err) {
		nodecg.log.error('[tracker] Error processing WebSocket message:', err);
	}
};

// Getting the initial donation total on startup.
updateDontationTotalFromAPI();
setInterval(updateDontationTotalFromAPI, 60000); // Also do this every 60s as a socket fallback.
