<template>
	<div class="Flex" :style="{ position: 'fixed', 'justify-content': 'center' }">
		<div
			id="Time"
			:class="timer.state"
			:style="{
				'font-size': '2.5em',
				transition: '1s',
			}"
		>
			<span>
				{{ timer.time }}
			</span>
		</div>
		<div
			v-if="runDataActiveRun"
			:style="{
				'margin-left': '22px',
				'font-size': '1.3em',
				display: 'flex',
				'flex-direction': 'row',
				'justify-content': 'center',
				width: '100%',
			}"
		>
			EST.
			<div :style="{ 'margin-left': '5px', width: estimateWidth }">
				<transition name="fade">
					<div
						id="Estimate"
						ref="Estimate"
						:key="`${runDataActiveRun.id}${runDataActiveRun.estimate}`"
						:style="{ position: 'absolute' }"
					>
						<span>
							{{ runDataActiveRun.estimate }}
						</span>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { replicantNS } from '@src/browser_shared/replicant_store';
	import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
	import {
		Timer as TimerType,
		RunDataActiveRun,
	} from '@bundles/nodecg-speedcontrol/src/types';

	@Component
	export default class Timer extends Vue {
		@replicantNS.State((s) => s.reps.timer) readonly timer!: TimerType;
		@replicantNS.State((s) => s.reps.runDataActiveRun)
		readonly runDataActiveRun!: RunDataActiveRun;
		@Ref('Estimate') readonly estimate!: HTMLElement;
		isMounted = false;
		estimateWidth = '0px';

		@Watch('runDataActiveRun', { immediate: true })
		onRunChange(newVal: TimerType, oldVal?: TimerType): void {
			if (!oldVal && newVal) {
				Vue.nextTick().then(() => {
					this.estimateWidth = `${this.estimate.clientWidth}px`;
				});
			}
		}
	}
</script>

<style scoped>
	.Flex {
		flex-direction: column;
	}

	/* Each character in the timer is in a span; setting width so the numbers appear monospaced. */
	#Time > span,
	#Estimate > span {
		display: inline-block;
		width: 100%;
	}
	#Time > .Colon,
	#Estimate > .Colon {
		width: 0.22em;
	}

	.stopped {
		color: #33ccff;
	}
	.running {
		color: #33ccff;
	}
	.paused {
		color: #33ccff;
	}
	.finished {
		color: #33ccff;
	}
</style>
