<template>
	<div id="Donation" class="d-flex" ref="Donation" :style="{ overflow: 'hidden' }" v-html="data"></div>
</template>

<script lang="ts">
	import { Vue, Component, Ref, Prop } from 'vue-property-decorator';
	import { gsap } from 'gsap';
	import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

	gsap.registerPlugin(ScrollToPlugin);

	@Component
	export default class TickerDonation extends Vue {
		@Prop(String) readonly data!: string;
		@Ref('Donation') readonly donation!: HTMLElement;

		mounted(): void {
			const fullWidth = this.donation.scrollWidth;
			const visibleWidth = this.donation.clientWidth;

			// Display time is minimum of 10s.
			let time = 10;
			if (fullWidth > visibleWidth) {
				const dist = fullWidth - visibleWidth;
				time = dist / 100 > 10 ? dist / 100 : 10;
			}

			gsap.to(this.donation, {
				duration: time,
				scrollTo: { x: 'max' },
				delay: 2,
				ease: 'none',
				onComplete: () => {
					setTimeout(() => this.$emit('end'), 2 * 1000);
				},
			});
		}
	}
</script>

<style scoped>
	#Donation {
		height: 100%;
		font-size: 44px;
		/* padding-top: 2px; */
		display: flex;
  		align-items: center;
		color: white;
		text-align: center;
		margin-bottom: -5px;
		text-shadow: 2px 2px 8px black;
	}
</style>