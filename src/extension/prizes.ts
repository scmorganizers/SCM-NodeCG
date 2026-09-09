import needle from 'needle';
import { Tracker } from '@src/types';
import { prizesReplicant } from './util/replicants';
import { getNodeCG } from './util/nodecg';
import { EVENT_ID, TRACKER_BASE_URL } from './util/constants';

const refreshTime = 60 * 1000; // Refresh prizes every 60s.
const nodecg = getNodeCG();

function processRawPrizes(rawPrizes: any): Tracker.FormattedPrize[] {
  const prizes: any[] = Array.isArray(rawPrizes) ? rawPrizes : (rawPrizes?.results || []);
  return prizes
    .filter((prize) => (prize.state || '').toUpperCase() === 'ACCEPTED')
    .map((prize) => {
      const startTime = prize.startrun?.starttime || prize.starttime;
      const endTime = prize.endrun?.endtime || prize.endtime;
      return {
        id: prize.id,
        name: prize.name,
        provided: prize.provider || undefined,
        minimumBid: parseFloat(prize.minimumbid || '0'),
        image: prize.image || undefined,
        // TOOD: Could these just be NaN instead of mapping to undefined?
        startTime: startTime ? Date.parse(startTime) : undefined,
        endTime: endTime ? Date.parse(endTime) : undefined,
      };
    });
}

export async function updatePrizes(): Promise<void> {
  try {
    const resp = await needle(
      'get',
      `${TRACKER_BASE_URL}/api/v2/events/${EVENT_ID}/prizes/`,
    );

    const currentPrizes = processRawPrizes(resp.body);
    prizesReplicant.value = currentPrizes;
  } catch (err) {
    nodecg.log.warn('Error getting prizes:', err);
    // TODO: Invalid?
    // prizesReplicant.value.length = 0; // Remove the data just in case
  }

  setTimeout(updatePrizes, refreshTime);
}
