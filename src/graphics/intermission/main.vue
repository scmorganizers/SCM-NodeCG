<template>
	<div>
		<img src="./background.png" />
		<upcoming-run
			:run-data="nextRun"
			:style="{
				left: '323px',
				top: '346px',
				width: '774px',
				height: '220px',
			}"
		/>
		<upcoming-run
			:run-data="onDeck"
			:style="{
				left: '323px',
				top: '618px',
				width: '774px',
				height: '220px',
			}"
		/>
		<sponsor-logos
			:style="{
				left: '1185px',
				top: '323px',
				width: '318px',
				height: '166px',
			}"
		/>
		<host
			:style="{
				left: '1160px',
				top: '570px',
				width: '368px',
				height: '90px',
			}"
		/>
		<donation-total
			:style="{
				left: '1160px',
				top: '696px',
				width: '368px',
				height: '90px',
			}"
		/>
		<ticker
			:style="{
				left: '212px',
				top: '876px',
				width: '1498px',
				height: '96px',
			}"
		/>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Watch } from 'vue-property-decorator';
	import { replicantNS } from '@src/browser_shared/replicant_store';
	import SponsorLogos from '../_misc/components/SponsorLogos.vue';
	import UpcomingRun from './components/UpcomingRun.vue';
	import DonationTotal from '../_misc/components/DonationTotal.vue';
	import Host from '../_misc/components/Host.vue';
	import Ticker from '../_misc/components/Ticker.vue';
	import { RunData } from '@bundles/nodecg-speedcontrol/src/types';
	import { RunDataActiveRunSurrounding, RunDataArray } from '@bundles/nodecg-speedcontrol/src/types/schemas';
	import { getNodeCG } from '@src/extension/util/nodecg';

	const nodecg = getNodeCG();

	@Component({
		components: {
			SponsorLogos,
			UpcomingRun,
			DonationTotal,
			Host,
			Ticker,
		},
	})
	export default class App extends Vue {
		@replicantNS.State((s) => s.reps.runDataArray)
		readonly runDataArray!: RunDataArray;
		@replicantNS.State((s) => s.reps.runDataActiveRunSurrounding)
		readonly runDataActiveRunSurrounding!: RunDataActiveRunSurrounding;
		nextRun: RunData | null = null;
		onDeckArr: RunData[] = [];

		get nextGameName(): string {
			return (
				(this.nextRun ? this.nextRun.game : undefined) || ''
			).toLowerCase();
		}

		mounted(): void {
			this.updateNextRuns();
			nodecg.listenFor('refreshIntermission', () => this.updateNextRuns());
		}

		updateNextRuns(): void {
			let runIndex = this.runDataArray.findIndex(
				(run) => run.id === this.runDataActiveRunSurrounding.next
			);
			this.nextRun = this.runDataArray[runIndex] || null;
			if (this.runDataActiveRunSurrounding.next) {
				runIndex = runIndex < 0 ? 1 : runIndex + 1;
				this.onDeckArr = this.runDataArray.slice(runIndex, runIndex + 3);
			} else {
				this.onDeckArr = [];
			}
		}

		// Update/cycle the "on deck" run when needed.
		onDeck: RunData | null = null;
		onDeckIndex = 0;
		onDeckInterval?: number;
		@Watch('onDeckArr', { immediate: true })
		onDeckChange(): void {
			window.clearInterval(this.onDeckInterval);
			this.onDeckIndex = 0;
			if (this.onDeckArr.length) {
				this.cycleOnDeck();
				this.onDeckInterval = window.setInterval(this.cycleOnDeck, 10000);
			} else {
				this.onDeck = null;
			}
		}
		cycleOnDeck(): void {
			this.onDeck = this.onDeckArr[this.onDeckIndex];
			this.onDeckIndex += 1;
			if (this.onDeckIndex >= this.onDeckArr.length) {
				this.onDeckIndex = 0;
			}
		}
	}
</script>

<style>
	@import url('../_misc/common.css');
	@import url('../_misc/Fade.css');
	@import url('../_misc/Flex.css');
</style>
