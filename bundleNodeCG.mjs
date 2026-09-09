import { nodeFileTrace } from '@vercel/nft';
import fs from 'fs-extra';
import path from 'path';

async function copyNodeModules() {
  const targetDir = 'nodecg';  // Folder containing all NodeCG resources used in production

  if (await fs.exists(`${targetDir}/node_modules/nodecg`)) {
    console.log(`NodeCG already found within ${targetDir}/node_modules. Skipping the bundling step.`);
    return;
  }

  console.log('🔍 Step 1: Tracing essential production dependencies...');
  const { fileList } = await nodeFileTrace(['node_modules/nodecg/index.js'], {
    base: process.cwd(),
    processEnv: { NODE_ENV: 'production' }
  });

  const tracedFiles = [...fileList].filter(f => f.startsWith('node_modules'));  // Copy traced node_modules only

  console.log(`📦 Step 2: Copying traced files into ./${targetDir} (${tracedFiles.length} files)...`);
  for (const file of tracedFiles) {
    const sourcePath = path.resolve(process.cwd(), file);
    const destPath = path.resolve(process.cwd(), targetDir, file);

    await fs.ensureDir(path.dirname(destPath));
    await fs.copy(sourcePath, destPath, { overwrite: true });
  }

  console.log(`\n🏁 Complete! The NodeCG server can now be launched using start.bat from inside the ${targetDir} folder.`);
}

copyNodeModules().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
