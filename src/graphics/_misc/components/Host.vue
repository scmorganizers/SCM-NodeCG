<template>
	<div :style="{ position: 'fixed' }">
		<transition name="fade">
			<div
				v-if="host"
				:key="host"
				class="Flex"
				:style="{ position: 'absolute' }"
			>
				<div
					:style="{
						'font-size': '1.3em',
						'line-height': '12px',
						'margin-top': '-20px',
					}"
				>
					<p style="font-family: 'Segoe UI Emoji'">HOSTS & COMMENTATORS</p>
					<div ref="host">
						{{ host }}
					</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Ref, Prop, Watch } from 'vue-property-decorator';
	import { Host as HostType } from '@src/types/schemas';
	import { replicantNS } from '@src/browser_shared/replicant_store';
	import fitty, { FittyInstance } from 'fitty';

	@Component
	export default class Host extends Vue {
		@replicantNS.State((s) => s.reps.host) readonly host!: HostType;
		hostFitty: FittyInstance | undefined;
		@Ref('host') hostRef!: HTMLElement;
		@Prop({ default: 54 }) readonly size!: number;

		fit(): void {
			this.hostFitty = fitty(this.hostRef, {
				maxSize: this.size,
				minSize: 20,
				multiLine: false,
			});
		}

		mounted() {
			setTimeout(() => {
				this.fit();
			}, 400);
		}

		@Watch('host')
		onHostChange() {
			setTimeout(() => {
				this.fit();
			}, 400);
		}
	}
</script>

<style scoped>
	.Flex {
		flex-direction: row;
	}
</style>
