export namespace Tracker {
	interface EventInfo {
		id: number;
		short: string;
		name: string;
		total?: number;
	}

	// The object from the tracker V2 API.
	interface Prize {
		type?: string;
		id: number;
		name: string;
		description: string; // Can be empty
		shortdescription: string; // Can be empty
		provider: string; // Can be empty
		minimumbid: string | number;
		image: string; // Can be empty
		startrun: number | object | null;
		endrun: number | object | null;
		starttime: string | null;
		endtime: string | null;
		state: string;
	}

	interface FormattedPrize {
		id: number;
		name: string;
		provided?: string;
		minimumBid: number;
		image?: string;
		startTime?: number;
		endTime?: number;
	}

	// The object from the tracker V2 API.
	interface Bid {
		type?: string;
		id: number;
		bid_type?: string;
		name: string;
		full_name?: string;
		event?: number;
		speedrun?: number | object | null;
		parent?: number | null;
		state: string;
		description: string;
		shortdescription: string;
		goal?: number | null;
		total: number;
		count?: number;
		istarget?: boolean;
		allowuseroptions?: boolean;
	}

	// The object from the tracker V2 API.
	interface Donation {
		type?: string;
		id: number;
		donor_name: string;
		event?: number;
		domain?: string;
		transactionstate: string;
		readstate: string;
		commentstate: string;
		amount: number;
		currency?: string;
		timereceived: string;
		comment: string;
	}

	interface FormattedDonation {
		id: number;
		name: string;
		amount: number;
		comment?: string;
		timestamp: number;
		bid?: {
			id?: number;
			amount?: number;
		}[];
	}

	interface DonationBid {
		id: number;
		bid: number;
		donation: number;
		amount: number;
	}
}

