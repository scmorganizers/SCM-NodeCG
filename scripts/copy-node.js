const fs = require('fs');
const path = require('path');

// Skip execution if the operating system is NOT Windows
if (process.platform !== 'win32') {
  console.log('Not on Windows. Skipping node.exe copy step.');
  process.exit(0);
}

const projectPath = process.cwd();
const outDir = path.join(projectPath, 'nodecg');  // Target folder for all built nodecg resources
const destPath = path.join(outDir, path.basename(process.execPath));

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

if (!fs.existsSync(destPath)) {
  fs.copyFileSync(process.execPath, destPath);
  console.log('node.exe copied to output folder.');
} else {
  console.log('node.exe already exists in output folder.');
}
