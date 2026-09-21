<template>
	<div>
		<img src="./background.png" />

		<sponsor-logos
			:style="{
				left: '804px',
				top: '344px',
				width: '314px',
				height: '124px',
			}"
		/>

		<timer
			:style="{
				left: '804px',
				top: '507px',
				width: '314px',
				height: '89px',
			}"
		/>
		<game
			:style="{
				left: '804px',
				top: '627px',
				width: '314px',
				height: '89px',
			}"
			:run="runDataActiveRun"
		/>
		<host
			:style="{
				left: '804px',
				top: '747px',
				width: '314px',
				height: '89px',
			}"
		/>
		<donation-total
			:style="{
				left: '804px',
				top: '861px',
				width: '314px',
				height: '89px',
			}"
		/>

		<ticker
			:style="{
				left: '25px',
				top: '989px',
				width: '1689px',
				height: '68px',
			}"
		/>

		<player
			:style="{
				left: '31px',
				top: '447px',
				width: '270px',
				height: '47px',
				textAlign: 'left',
			}"
			:nameOnly=true
		/>
		<player
			:style="{
				left: '1154px',
				top: '447px',
				width: '270px',
				height: '47px',
				textAlign: 'left',
			}"
			:nameOnly=true
		/>
		<player
			:style="{
				left: '1621px',
				top: '491px',
				width: '270px',
				height: '47px',
				textAlign: 'right',
			}"
			:nameOnly=true
		/>
		<player
			:style="{
				left: '497px',
				top: '491px',
				width: '270px',
				height: '47px',
				textAlign: 'right',
			}"
			:nameOnly=true
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
