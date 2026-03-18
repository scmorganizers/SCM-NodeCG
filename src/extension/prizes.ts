import needle from 'needle';
import { prizesReplicant } from './util/replicants';
import { getNodeCG } from './util/nodecg';
import { Tracker } from '@src/types';

const refreshTime = 60 * 1000; // Refresh prizes every 60s.
const nodecg = getNodeCG();

function processRawPrizes(
	rawPrizes: Tracker.Prize[]
): Tracker.FormattedPrize[] {
	return Array.from(rawPrizes)
		.filter((prize) => prize.fields.state === 'ACCEPTED')
		.map((prize) => {
			const startTime =
				prize.fields.startrun__starttime || prize.fields.starttime;
			const endTime = prize.fields.endrun__endtime || prize.fields.endtime;
			return {
				id: prize.pk,
				name: prize.fields.name,
				provided: prize.fields.provider || undefined,
				minimumBid: parseFloat(prize.fields.minimumbid),
				image: prize.fields.image || undefined,
				startTime: startTime ? Date.parse(startTime) : undefined,
				endTime: endTime ? Date.parse(endTime) : undefined,
			};
		});
}

export async function updatePrizes(): Promise<void> {
	try {
		const resp = await needle(
			'get',
			`https://donate.soulsspeedruns.coms/search/?event=2&type=prize`
		);
		const currentPrizes = processRawPrizes(resp.body);
		prizesReplicant.value = currentPrizes;
	} catch (err) {
		nodecg.log.warn('Error getting prizes:', err);
		// TODO: Invalid?
		//prizesReplicant.value.length = 0; // Remove the data just in case
	}
	setTimeout(updatePrizes, refreshTime);
}
