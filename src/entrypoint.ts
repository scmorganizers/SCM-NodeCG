import path from 'path';
import { rootPaths } from '@nodecg/internal-util';

// Change current working directory to the directory containing this script (nodecg/)
// to ensure all bundles, configs, database, and assets resolve relative to it.
process.chdir(__dirname);

// Locate the installed nodecg package (resolving from current or parent directories)
const nodecgMain = require.resolve('nodecg', { paths: [__dirname, path.resolve(__dirname, '..')] });
const nodecgPath = path.resolve(path.dirname(nodecgMain), '../..');

// Intercept @nodecg/internal-util so that nodecgInstalledPath points to the actual
// nodecg installation directory, removing the need to install nodecg separately in this folder.
Object.defineProperty(rootPaths, 'nodecgInstalledPath', {
    get: () => nodecgPath,
    configurable: true,
    enumerable: true,
});

// Require nodecg main entrypoint to start the server
require(nodecgMain);
