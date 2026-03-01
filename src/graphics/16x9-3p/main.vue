<template>
	<div>
		<img src="./background.png" />
		
		<!-- Based on top left corner + sizes from photoshop file -->
		<sponsor-logos
			:style="{
				left: '151px',
				top: '775px',
				width: '320px',
				height: '120px',
			}"
		/>

		<!-- left + 10px, top + 10px, width - 20px, height-->
		<player
			:style="{
				left: '138px',
				top: '450px',
				width: '300px',
				height: '50px',
			}"
			:nameOnly=true
			:team="1"
		/>
		<player
			:style="{
				left: '1482px',
				top: '450px',
				width: '300px',
				height: '50px',
			}"
			:nameOnly=true
			:team="2"
		/>
		<player
			:style="{
				left: '1050px',
				top: '492px',
				width: '300px',
				height: '50px',
			}"
			:nameOnly=true
			:team="3"
		/>

		<!-- left + 10px, top, width - 20px, height-->
		<timer
			:style="{
				left: '570px',
				top: '540px',
				width: '300px',
				height: '90px',
			}"
		/>
		<game
			:style="{
				left: '570px',
				top: '640px',
				width: '300px',
				height: '90px',
			}"
			:run="runDataActiveRun"
		/>
		<host
			:style="{
				left: '570px',
				top: '740px',
				width: '300px',
				height: '90px',
			}"
		/>
		<donation-total
			:style="{
				left: '570px',
				top: '840px',
				width: '300px',
				height: '90px',
			}"
		/>

		<!-- Same as 2023 -->
		<ticker
			:style="{
				left: '24px',
				top: '979px',
				width: '1874px',
				height: '82px',
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
