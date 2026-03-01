import needle from 'needle';
import ws from 'websocket';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { get } from './util/nodecg';
import { donationTotal } from './util/replicants';

const nodecg = get();
const statsURL = 'https://donate.soulsspeedruns.com/event/2?json';

// Get donation total from HTTPS API, backup for the repeater socket server.
// We need to add both events together to get the correct total.
async function updateDontationTotalFromAPI(): Promise<void> {
	try {
		const resp = await needle('get', statsURL);
		if (resp.statusCode !== 200) {
			throw new Error(JSON.stringify(resp.body));
		}
		const total = resp.body.agg.amount ? parseFloat(resp.body.agg.amount) : 0;
		if (donationTotal.value !== total) {
			nodecg.log.info(`[tracker] API donation total changed: $${total}`);
		}
		donationTotal.value = total;
	} catch (err) {
		nodecg.log.info('[tracker] Issue getting API donation total:', err);
	}
}

const options = {
    WebSocket: ws.w3cwebsocket, // custom WebSocket constructor
    connectionTimeout: 1000,
    maxRetries: 100,
};

const client = new ReconnectingWebSocket('wss://donate.soulsspeedruns.com/ws/processing/',[], options);
client.binaryType = "arraybuffer";

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
	let evt: DonoEvt = JSON.parse(e.data.toString());
	nodecg.log.info(`[tracker] Donation event received: [${evt.donation.id}] ${evt.donation.donor_name} - $${evt.donation.amount} (${evt.donation.readstate})`);
	// console.log(evt)

	// Exit early in case we receive an event with dono that hasn't been completed
	if(evt.donation.transactionstate !== "COMPLETED") {
		return
	}

	// Check if we have latest donation
	if (evt.donation.id > last_donation_id) {
		last_donation_id = evt.donation.id;
		// If the latest donation has a new total, update the UI
		if (evt.event_total > 0) {
			donationTotal.value = evt.event_total;
			nodecg.log.info(
				`[tracker] Updated donation total received: $${evt.event_total.toFixed(2)}`
			);
		}
	}

	// Show comment on the stream
	if(evt.donation.readstate === "READ")  {
		nodecg.sendMessage('newDonation', {
			donor_name: evt.donation.donor_name,
			amount: evt.donation.amount.toString(),
			comment: evt.donation.comment,
		});
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
}

interface DonoEvt {
	donation: Dono;
	event_total: number;
}

// Getting the initial donation total on startup.
updateDontationTotalFromAPI();
setInterval(updateDontationTotalFromAPI, 60000); // Also do this every 60s as a socket fallback.
