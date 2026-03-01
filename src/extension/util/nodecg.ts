// FIXME: Old typing, no longer valid. Get from nodecg dependency instead.
import type { NodeCG } from '@src/types/nodecg/server';

var nodecg: NodeCG;

export function set(ctx: NodeCG): void {
	nodecg = ctx;
}

export function get(): NodeCG {
	return nodecg;
}
