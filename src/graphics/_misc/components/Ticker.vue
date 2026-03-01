<template>
	<div
		id="Ticker"
		:style="{
			position: 'fixed',
			'font-size': '1.5em',
			'box-sizing': 'border-box',
			padding: '0 10px',
			'white-space': 'nowrap',
			overflow: 'hidden',
		}"
	>
		<transition name="fade" mode="out-in">
			<component
				:is="currentComponent.name"
				:key="timestamp"
				:data="currentComponent.data"
				@end="showNextMsg"
			/>
		</transition>
	</div>
</template>

<script>
	import TickerGenericMessage from './Ticker/GenericMessage.vue';
	import TickerNextRun from './Ticker/NextRun.vue';
	import TickerDonation from './Ticker/Donation.vue';
	import TickerBid from './Ticker/Bid.vue';
	const bids = nodecg.Replicant('currentBids');
	const runs = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
	const activeRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
	const newDonations = [];

	export default {
		name: 'Ticker',
		data() {
			return {
				currentComponent: {
					name: '',
					data: {},
				},
				currentComponentIndex: 0,
				timestamp: Date.now(),
				messageTypes: [],
			};
		},
		mounted() {
			NodeCG.waitForReplicants(bids, runs, activeRun).then(() => {
				nodecg.listenFor('newDonation', (data) => newDonations.push(data));
				this.messageTypes = [
					this.scmPromo(),
					this.schedulePromo(),
					this.merchURL(),
					this.nextRun(),
					this.availableBid(),
				];

				this.currentComponent = this.messageTypes[0];
			});
		},
		methods: {
			showNextMsg() {
				console.log('SHOWING NEXT MESSAGE');
				let currentComponent;
				if (newDonations.length) {
					currentComponent = this.donation(newDonations[0]);
					newDonations.shift();
				} else {
					this.currentComponentIndex += 1;
					if (this.currentComponentIndex >= this.messageTypes.length) {
						this.currentComponentIndex = 0;
					}
					currentComponent = this.messageTypes[this.currentComponentIndex];
				}
				this.currentComponent = currentComponent;
				this.timestamp = Date.now();
			},

			scmPromo() {
				return this.genericMsg(
					'Welcome to&nbsp;<b style="color: #33ccff">Souls Charity Marathon 2024</b>'
				);
			},

			schedulePromo() {
				return this.genericMsg(
					'<b>You can find the schedule over at&nbsp;</b>&nbsp;<b style="color: #33ccff">oengus.io/marathon/scm2024</b>'
				);
			},

			merchURL() {
				return this.genericMsg(
					'You can find our merch over at&nbsp;<b style="color: #33ccff">merch.soulsspeedruns.com</b>'
				);
			},

			nextRun() {
				return {
					name: TickerNextRun,
				};
			},

			availableBid() {
				return {
					name: TickerBid,
				};
			},

			donation(donation) {
				const donationText = `New &nbsp;<b style="color: #33ccff">$${donation.amount}</b>&nbsp; donation from &nbsp;<b style="color: #33ccff">${donation.donor_name}</b>&nbsp; - ${donation.comment}`;
				return {
					name: TickerDonation,
					data: donationText,
				};
			},

			genericMsg(string) {
				return {
					name: TickerGenericMessage,
					data: {
						msg: string,
					},
				};
			},

			formatDollars(amount) {
				return (
					'$' +
					parseFloat(amount).toLocaleString('en-US', {
						maximumFractionDigits: 0,
					})
				);
			},

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

			findRunIndex(currentRun, allRuns) {
				if (!currentRun) {
					return -1;
				}
				return allRuns.findIndex((run) => run.id === currentRun.id);
			},
		},
	};
</script>

<style scoped>
	#Ticker {
		height: 100%;
		min-width: 0;
		flex: 1;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}

	.fade-enter,
.fade-leave-to

/* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
</style>
