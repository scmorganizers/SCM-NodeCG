const fs = require('fs');
const path = require('path');

const projectPath = process.cwd();
const projectName = path.basename(projectPath);

/**
 * Recursively copies a directory or file.
 * Also performs path correction in .html files.
 */
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
        if (dest.endsWith('.html') || dest.endsWith('.css') || dest.endsWith('.js')) {
            let content = fs.readFileSync(dest, 'utf8');
            content = content.replaceAll(encodeURI(`/bundles/${projectName}`), '/bundles/scm-nodecg');  // Correct the paths to the shared assets
            fs.writeFileSync(dest, content);
        }
    }
}

/**
 * Copies a folder to nodecg/ and deletes the original.
 */
function moveToNodeCG(folder) {
    const src = path.join(__dirname, '..', folder);
    const dest = path.join(__dirname, '..', 'nodecg', folder);

    if (fs.existsSync(src)) {
        console.log(`Moving ${folder} to nodecg/${folder}...`);
        if (fs.existsSync(dest)) {  // Remove existing folders in NodeCG first. Filenames may contain hashes.
            fs.rmSync(dest, { recursive: true, force: true });
        }
        
        copyRecursiveSync(src, dest);
        fs.rmSync(src, { recursive: true, force: true });
    }
}

moveToNodeCG('dashboard');
moveToNodeCG('graphics');
moveToNodeCG('shared');

console.log('Build artifacts moved to nodecg directory and root cleaned up.');
