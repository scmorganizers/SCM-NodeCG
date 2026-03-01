<template>
	<div>
		<img src="./background.png" />
		<timer
			:style="{
				left: '1482px',
				top: '494px',
				width: '316px',
				height: '80px',
			}"
		/>
		<game
			:style="{
				left: '1482px',
				top: '604px',
				width: '316px',
				height: '80px',
			}"
			:run="runDataActiveRun"
		/>
		<player
			:style="{
				left: '1482px',
				top: '384px',
				width: '316px',
				height: '80px',
			}"
		/>
		<host
			:style="{
				left: '1482px',
				top: '714px',
				width: '316px',
				height: '80px',
			}"
		/>
		<donation-total
			:style="{
				left: '1482px',
				top: '826px',
				width: '316px',
				height: '80px',
			}"
		/>
		<ticker
			:style="{
				left: '22px',
				top: '980px',
				width: '1874px',
				height: '82px',
			}"
		/>
		<sponsor-logos
		:style="{
				left: '1502px',
				top: '258px',
				width: '276px',
				height: '78px',
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
	}
</script>

<style>
	@import url('../_misc/common.css');
	@import url('../_misc/Fade.css');
	@import url('../_misc/Flex.css');
</style>
