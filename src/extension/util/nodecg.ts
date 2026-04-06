import type NodeCG from 'nodecg/types';

var nodecg: NodeCG.ServerAPI;

export function setNodeCG(ctx: NodeCG.ServerAPI): void {
	nodecg = ctx;
}

export function getNodeCG(): NodeCG.ServerAPI {
	return nodecg;
}
