<template>
	<div>
		<img src="./background.png" />

		<sponsor-logos
			:style="{
				left: '803px',
				top: '792px',
				width: '314px',
				height: '124px',
			}"
		/>

		<player
			:style="{
				left: '7px',
				top: '705px',
				width: '270px',
				height: '47px',
				textAlign: 'left',
			}"
			:nameOnly=true
			:team="1"
		/>
		<player
			:style="{
				left: '1644px',
				top: '705px',
				width: '270px',
				height: '47px',
				textAlign: 'right',
			}"
			:nameOnly=true
			:team="2"
		/>

		<timer
			:style="{
				left: '33px',
				top: '810px',
				width: '314px',
				height: '89px',
			}"
		/>
		<game
			:style="{
				left: '412px',
				top: '810px',
				width: '314px',
				height: '89px',
			}"
			:run="runDataActiveRun"
		/>
		<host
			:style="{
				left: '1188px',
				top: '810px',
				width: '314px',
				height: '89px',
			}"
		/>
		<donation-total
			:style="{
				left: '1579px',
				top: '810px',
				width: '314px',
				height: '89px',
			}"
		/>

		<ticker
			:style="{
				left: '26px',
				top: '960px',
				width: '1874px',
				height: '84px',
			}"
		/>
	</div>
</template>

<script lang="ts">
	import { Vue, Component } from 'vue-property-decorator';
	import { replicantNS } from '@src/browser_shared/replicant_store';
	import SponsorLogos from '../_misc/components/SponsorLogos.vue';
	import DonationTotal from '../_misc/components/DonationTotal.vue';
	import Host from '../_misc/components/Host.vue';
	import Ticker from '../_misc/components/Ticker.vue';
	import Timer from '../_misc/components/Timer.vue';
	import Game from '../_misc/components/Game.vue';
	import Player from '../_misc/components/Player.vue';
	import { RunDataActiveRun } from '@bundles/nodecg-speedcontrol/src/types';

	@Component({
		components: {
			SponsorLogos,
			DonationTotal,
			Host,
			Ticker,
			Timer,
			Game,
			Player,
		},
	})
	export default class App extends Vue {
		@replicantNS.State((s) => s.reps.runDataActiveRun)
		readonly runDataActiveRun!: RunDataActiveRun;
		@replicantNS.State((s) => s.reps.nameCycle) readonly nameCycle!: number;
	}
</script>

<style>
	@import url('../_misc/common.css');
	@import url('../_misc/Fade.css');
	@import url('../_misc/Flex.css');
</style>
