import { ExtensionReturn, Timer } from '@bundles/nodecg-speedcontrol/src/types';
import { getNodeCG } from './util/nodecg';
import obs from './util/obs';

const nodecg = getNodeCG();
const speedcontrol = nodecg.extensions['nodecg-speedcontrol'] as unknown as ExtensionReturn;
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');

timer.on('change', (newVal, oldVal) => {
	if (oldVal?.state !== 'finished' && newVal?.state === 'finished') {
		nodecg.sendMessage('refreshIntermission');
	}
});

nodecg.listenFor('nextRun', (data, ack) => {
	console.log('next run')
	obs.changeToIntermission().catch((err) => {console.log(err);});
	setTimeout(() => speedcontrol.sendMessage('changeToNextRun'), 500);
	obs.muteAudio();
	obs.unmuteAudio();

	if (ack && !ack.handled) {
		ack(null);
	}
});
