<template>
	<div>
		<img src="./background.png" />
		<timer
			:style="{
				left: '800px',
				top: '878px',
				width: '320px',
				height: '80px',
			}"
		/>
		<game
			:style="{
				left: '450px',
				top: '878px',
				width: '320px',
				height: '80px',
			}"
			:run="runDataActiveRun"
		/>
		<transition name="fade">
			<player
				:style="{
					left: '101px',
					top: '878px',
					width: '320px',
					height: '80px',
				}"
				:team="1"
				:size="50"
				key="team1"
				v-if="nameCycle === 0 || nameCycle === 2"
			/>
			<player
				:style="{
					left: '101px',
					top: '878px',
					width: '320px',
					height: '80px',
				}"
				:team="2"
				:size="50"
				key="team2"
				v-if="nameCycle === 1 || nameCycle === 3"
			/>
		</transition>
		<host
			:style="{
				left: '1150px',
				top: '878px',
				width: '320px',
				height: '80px',
			}"
		/>
		<donation-total
			:style="{
				left: '1500px',
				top: '878px',
				width: '320px',
				height: '80px',
			}"
		/>
		<ticker
			:style="{
				left: '24px',
				top: '979px',
				width: '1874px',
				height: '82px',
			}"
		/>
		<sponsor-logos
			:style="{
				left: '43px',
				top: '40px',
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
		@replicantNS.State((s) => s.reps.nameCycle) readonly nameCycle!: number;
	}
</script>

<style>
	@import url('../_misc/common.css');
	@import url('../_misc/Fade.css');
	@import url('../_misc/Flex.css');
</style>
