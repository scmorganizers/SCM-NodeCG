import { ExtensionReturn, Timer } from '@bundles/nodecg-speedcontrol/src/types';
import { get } from './util/nodecg';
import obs from './util/obs';

const nodecg = get();
const speedcontrol = nodecg.extension['nodecg-speedcontrol'] as unknown as ExtensionReturn;
const timer = nodecg.Replicant<Timer>('timer', 'nodecg-speedcontrol');

timer.on('change', (newVal, oldVal) => {
	if (oldVal && oldVal.state !== 'finished' && newVal.state === 'finished') {
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
