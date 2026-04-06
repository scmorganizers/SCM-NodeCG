/* eslint-disable max-len */

import type { DonationTotal, Host, Prizes } from '@src/types/schemas';
import { getNodeCG } from './nodecg';

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

const nodecg = getNodeCG();

export const donationTotal = nodecg.Replicant<DonationTotal>('donationTotal');
export const host = nodecg.Replicant<Host>('host');
export const nameCycleReplicant = nodecg.Replicant<number>('nameCycle');
export const prizesReplicant = nodecg.Replicant<Prizes>('prizes');
export const currentOBSScene = nodecg.Replicant<string>('currentOBSScene');
