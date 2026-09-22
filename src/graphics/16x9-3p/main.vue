<template>
	<div>
		<img src="./background.png" />
		
		<sponsor-logos
			:style="{
				left: '105px',
				top: '569px',
				width: '314px',
				height: '124px',
			}"
		/>

		<timer
			:style="{
				left: '105px',
				top: '728px',
				width: '314px',
				height: '89px',
			}"
		/>

		<game
			:style="{
				left: '105px',
				top: '852px',
				width: '314px',
				height: '89px',
			}"
			:run="runDataActiveRun"
		/>

		<host
			:style="{
				left: '508px',
				top: '852px',
				width: '314px',
				height: '89px',
			}"
		/>

		<donation-total
			:style="{
				left: '508px',
				top: '728px',
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
				left: '102px',
				top: '459px',
				width: '270px',
				height: '47px'
			}"
			:nameOnly=true
			:team="1"
			:align="'left'"
		/>
		<player
			:style="{
				left: '1062px',
				top: '459px',
				width: '270px',
				height: '47px'
			}"
			:nameOnly=true
			:team="2"
			:align="'left'"
		/>
		<player
			:style="{
				left: '1549px',
				top: '487px',
				width: '270px',
				height: '47px'
			}"
			:nameOnly=true
			:team="3"
			:align="'right'"
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
