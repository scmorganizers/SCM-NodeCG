import { nameCycleReplicant } from './util/replicants';

let cycleTimeout: NodeJS.Timeout;

// Controls the name cycling ticks for players/hosts
function cycleNames(reset = false): void {
	clearTimeout(cycleTimeout);
	let cycle = 0;
	if (!reset) {
		cycle = nameCycleReplicant.value + 1;
	}
	if (cycle === 0) {
		// Player 1
		cycleTimeout = setTimeout(cycleNames, 20 * 1000);
	} else if (cycle === 1) {
		// Player 2
		cycleTimeout = setTimeout(cycleNames, 20 * 1000);
	} else if (cycle === 2) {
		// Player 3
		cycleTimeout = setTimeout(cycleNames, 20 * 1000);
	} else if (cycle === 3) {
		// Player 4
		cycleTimeout = setTimeout(cycleNames, 20 * 1000);
	} else {
		cycleNames(true);
		return;
	}
	nameCycleReplicant.value = cycle;
}

cycleNames(true);
