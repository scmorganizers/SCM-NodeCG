<template>
	<div>
		<img src="./background.png" />

		<!-- Based on top left corner + sizes from photoshop file -->
		<sponsor-logos
			:style="{
				left: '29px',
				top: '280px',
				width: '320px',
				height: '120px',
			}"
		/>

		<!-- left + 10px, top, width - 20px, height-->
		<timer
			:style="{
				left: '39px',
				top: '422px',
				width: '300px',
				height: '90px',
			}"
		/>
		<game
			:style="{
				left: '39px',
				top: '522px',
				width: '300px',
				height: '90px',
			}"
			:run="runDataActiveRun"
		/>
		<player
			:style="{
				left: '39px',
				top: '622px',
				width: '300px',
				height: '90px',
			}"
			:team="player"
		/>
		<host
			:style="{
				left: '39px',
				top: '722px',
				width: '300px',
				height: '90px',
			}"
		/>
		<donation-total
			:style="{
				left: '39px',
				top: '822px',
				width: '300px',
				height: '90px',
			}"
		/>
		
		<!-- Same as 2023 -->
		<ticker
			:style="{
				left: '29px',
				top: '980px',
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

		urlParams = new URLSearchParams(window.location.search);
		player = Number(this.urlParams.get('player') || 1);
	}
</script>

<style>
	@import url('../_misc/common.css');
	@import url('../_misc/Fade.css');
	@import url('../_misc/Flex.css');
</style>
