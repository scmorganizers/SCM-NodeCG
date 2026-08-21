/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias').addAlias(
	'@src',
	require('path').join(__dirname, '.')
);

import type NodeCG from 'nodecg/types';
import { setNodeCG } from './util/nodecg';

// TODO: Validate this
export = (nodecg: NodeCG.ServerAPI): void => {
	setNodeCG(nodecg);

	// Use `require`s to force things to be loaded *after* the NodeCG context is set and extensions are loaded
	nodecg.on('extensionsLoaded', () => {
		require('./util/obs');  // Make sure OBS connection is setup
		require('./tracker');
		require('./layouts');
		require('./cycle');
		require('./bids');
	});
};
