<template>
	<div :style="{ position: 'fixed' }">
		<div v-if="name" :key="name" class="Flex" :style="{ position: 'absolute' }">
			<div
				:style="{
					'font-size': small ? '1.1em' : '1.3em',
					'line-height': '12px',
					'margin-top': '-20px',
				}"
			>
				<p v-if="!nameOnly" style="font-family: 'Segoe UI Emoji'">
					RUNNER <template v-if="hasMultipleTeams">{{ team }}</template>
				</p>
				<div ref="player">
					{{ name }}
					<span v-if="finishTime" :style="{ 'font-size': '0.95em' }">
						[{{ finishTime }}]
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { replicantNS } from '@src/browser_shared/replicant_store';
	import { Vue, Component, Prop, Watch, Ref } from 'vue-property-decorator';
	import {
		RunDataActiveRun,
		Timer,
	} from '@bundles/nodecg-speedcontrol/src/types';
	import fitty, { FittyInstance } from 'fitty';
	@Component
	export default class Player extends Vue {
		@replicantNS.State((s) => s.reps.runDataActiveRun)
		readonly run!: RunDataActiveRun;
		@replicantNS.State((s) => s.reps.timer) readonly timer!: Timer;
		@Prop(Boolean) readonly small!: boolean;
		@Prop({ default: 1 }) readonly team!: number;
		@Prop({ default: 64 }) readonly size!: number;
		@Prop({ default: false }) readonly nameOnly!: boolean;
		timeout?: number;
		@Ref('player') player!: HTMLDivElement;
		teamI = 0;
		index = 0;
		name: string | null = null;
		hasMultipleTeams: boolean = false;
		playerFitty: FittyInstance | undefined;
		fit(): void {
			this.playerFitty = fitty(this.player, {
				maxSize: this.size,
				minSize: 32,
				multiLine: true,
			});
		}
		get finishTime(): string | undefined {
			if (!this.run || this.run.teams.length <= 1) {
				return undefined;
			}
			const teamFinishTime =
				this.timer.teamFinishTimes[this.run.teams[this.teamI].id];
			if (teamFinishTime) {
				if (teamFinishTime.state === 'completed') {
					return this.timer.teamFinishTimes[this.run.teams[this.teamI].id].time;
				}
				if (teamFinishTime.state === 'forfeit') {
					return 'Forfeit';
				}
			}
			return undefined;
		}

		@Watch('run', { immediate: true })
		onRunChange(val: RunDataActiveRun): void {
			window.clearTimeout(this.timeout);
			if (val) {
				this.hasMultipleTeams = val.teams.length >= 2;
			} else {
				this.hasMultipleTeams = false;
			}
			this.teamI = this.team - 1;
			this.index = 0;
			this.name = null;
			const coop = !!(
				val &&
				val.teams.length === 1 &&
				val.teams[0].players.length >= 2
			);

			if (val) {
				if (coop && val.teams[0].players[this.teamI]) {
					this.name = val.teams[0].players[this.teamI].name;
				} else if (
					!coop &&
					val.teams[this.teamI] &&
					val.teams[this.teamI].players.length
				) {
					this.showNextName();
				}
			}
			setTimeout(() => {
				this.fit();
			}, 400);
		}

		showNextName(): void {
			if (!this.run) {
				return;
			}
			const { players } = this.run.teams[this.teamI];
			this.name = players[this.index].name;
			this.timeout = window.setTimeout(() => this.showNextName(), 30 * 1000);
			this.index = players.length <= this.index + 1 ? 0 : this.index + 1;
		}
	}
</script>
