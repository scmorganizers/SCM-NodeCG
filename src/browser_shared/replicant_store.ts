import { Asset } from '@src/types';
import type { DonationTotal, Host } from '@src/types/schemas';
import clone from 'clone';
import type NodeCG from 'nodecg/types';
import Vue from 'vue';
import type { Store } from 'vuex';
import { namespace } from 'vuex-class';
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { RunDataActiveRun, RunDataArray } from '@bundles/nodecg-speedcontrol/src/types';
import { RunDataActiveRunSurrounding, Timer } from '@bundles/nodecg-speedcontrol/src/types/schemas';
import { getNodeCG } from '@src/extension/util/nodecg';

const nodecg = getNodeCG();

// Declaring replicants.
export const reps: {
	assetsSponsorLogos: NodeCG.ServerReplicant<Asset[]>;
	donationTotal: NodeCG.ServerReplicant<DonationTotal>;
	host: NodeCG.ServerReplicant<Host>;
	runDataActiveRun: NodeCG.ServerReplicant<RunDataActiveRun>;
	runDataActiveRunSurrounding: NodeCG.ServerReplicant<RunDataActiveRunSurrounding>;
	runDataArray: NodeCG.ServerReplicant<RunDataArray>;
	timer: NodeCG.ServerReplicant<Timer>;
	nameCycle: NodeCG.ServerReplicant<number>;
	[k: string]: NodeCG.ServerReplicant<unknown>;
} = {
	assetsSponsorLogos: nodecg.Replicant('assets:sponsor-logos'),
	donationTotal: nodecg.Replicant('donationTotal'),
	host: nodecg.Replicant('host'),
	runDataActiveRun: nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
	runDataActiveRunSurrounding: nodecg.Replicant('runDataActiveRunSurrounding', 'nodecg-speedcontrol'),
	runDataArray: nodecg.Replicant('runDataArray', 'nodecg-speedcontrol'),
	timer: nodecg.Replicant('timer', 'nodecg-speedcontrol'),
	nameCycle: nodecg.Replicant('nameCycle'),
};

// All the replicant types.
export interface ReplicantTypes {
	assetsSponsorLogos: Asset[];
	donationTotal: DonationTotal;
	host: Host;
	runDataActiveRun: RunDataActiveRun;
	runDataActiveRunSurrounding: RunDataActiveRunSurrounding;
	runDataArray: RunDataArray;
	timer: Timer;
	nameCycle: number;
}

@Module({ name: 'ReplicantModule', namespaced: true })
export class ReplicantModule extends VuexModule {
	// Replicant values are stored here.
	reps: { [k: string]: unknown } = {};

	// This sets the state object above when a replicant sends an update.
	@Mutation
	setState({ name, val }: { name: string; val: unknown }): void {
		Vue.set(this.reps, name, clone(val));
	}

	// This is a generic mutation to update a named replicant.
	@Mutation
	setReplicant<K>({ name, val }: { name: string; val: K }): void {
		Vue.set(this.reps, name, clone(val)); // Also update local copy, although no schema validation!
		reps[name].value = clone(val);
	}
}

// eslint-disable-next-line import/no-mutable-exports
export let replicantModule!: ReplicantModule;
export const replicantNS = namespace('ReplicantModule');

export async function setUpReplicants(store: Store<unknown>): Promise<void> {
	// Listens for each declared replicants "change" event, and updates the state.
	Object.keys(reps).forEach((name) => {
		reps[name].on('change', (val) => {
			store.commit('ReplicantModule/setState', { name, val });
		});
	});
	// We should make sure the replicant are ready to be read, needs to be done in browser context.
	// TODO: This seems to match documentation, but cannot call NodeCG since it is a type???
	// await NodeCG.waitForReplicants(...Object.keys(reps).map((key) => reps[key]));
	replicantModule = getModule(ReplicantModule, store);
}
