<template>
	<div id="Bid" class="Flex" ref="Bid" :style="cssProps" v-html="msg"></div>
</template>

<script>
	const bids = nodecg.Replicant('currentBids');
	import gsap from 'gsap';
	import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

	gsap.registerPlugin(ScrollToPlugin);

	export default {
		name: 'TickerBid',
		data() {
			return {
				msg: '',
				size: 44,
				time: 5,
			};
		},
		computed: {
			cssProps() {
				return {
					'--font-size': `${this.$data.size}px`,
				};
			},
		},
		mounted() {
			let text;
			const latestBids = bids.value.slice(0, 3);
			if (!latestBids.length) {
				this.$emit('end');
			}
			let bidToShowIndex = Math.floor(Math.random() * latestBids.length);
			const bidToShow = latestBids[bidToShowIndex];
			if (bidToShow.type === 'challenge') {
				text = `Upcoming incentive: &nbsp;<b style="color: #33ccff">${bidToShow.game} - ${bidToShow.name} </b>&nbsp; - &nbsp;${bidToShow.total}/${
					bidToShow.goal
				} &nbsp;(${Math.round((bidToShow.rawTotal / bidToShow.rawGoal) * 100)}%)`;
			} else {
				text = `Upcoming incentive: &nbsp;<b style="color: #33ccff">${bidToShow.game} - ${bidToShow.name}</b> &nbsp;`;
				bidToShow.options.forEach((option) => {
					text += `- ${option.name} ${option.total} `;
				});
			}
			this.$data.msg = text;

			console.log('Bid: mounted');
			const fullWidth = this.$refs.Bid.scrollWidth;
			const visibleWidth = this.$refs.Bid.clientWidth;

			// Display time is minimum of 10s.
			let time = 10;
			if (fullWidth > visibleWidth) {
				const dist = fullWidth - visibleWidth;
				time = dist / 100 > 10 ? dist / 100 : 10;
			}

			gsap.to(this.$refs.Bid, {
				duration: time,
				scrollTo: { x: 'max' },
				delay: 2,
				ease: 'none',
				onComplete: () => {
					console.log('Bid: ended');
					setTimeout(() => this.$emit('end'), 2 * 1000);
				},
			});
		},
	};
</script>

<style scoped>
	#Bid {
		height: 100%;
		font-size: var(--font-size);
		color: white;
		text-align: center;
		margin-bottom: -5px;
		text-shadow: 2px 2px 8px black;
	}
</style>
