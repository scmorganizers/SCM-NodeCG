<template>
	<div id="NextRun" class="Flex" :style="cssProps" v-html="msg"></div>
</template>

<script>
	const runDataActiveRun = nodecg.Replicant(
		'runDataActiveRun',
		'nodecg-speedcontrol'
	);
	const runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
	import clone from 'clone';

	export default {
		name: 'TickerNextRun',
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
			const nextRun = runDataArray.value[this.findRunIndex() + 1];
			if (nextRun) {
				this.$data.msg = `Next Run: &nbsp;<b style="color: #33ccff">${nextRun.game} ${
					nextRun.category
				}</b>, ran by &nbsp;<b style="color: #33ccff">${this.formatPlayers(nextRun)}</b>`;
			} else {
				this.$data.msg = "No next run, it's almost over 😥";
			}
			console.log('nextRun: mounted');
			setTimeout(() => {
				this.$emit('end');
				console.log('nextRun: ended');
			}, this.$data.time * 1000);
		},
		methods: {
			formatPlayers(run) {
				return (
					run.teams
						.map(
							(team) =>
								team.name ||
								team.players.map((player) => player.name).join(', ')
						)
						.join(' vs. ') || 'No players'
				);
			},

			findRunIndex() {
				if (!runDataActiveRun.value) {
					return -1;
				}
				return clone(runDataArray.value).findIndex(
					(run) => run.id === runDataActiveRun.value.id
				);
			},
		},
	};
</script>

<style scoped>
	#NextRun {
		height: 100%;
		font-size: var(--font-size);
		color: white;
		text-align: center;
		margin-bottom: -5px;
		text-shadow: 2px 2px 8px black;
	}
</style>
