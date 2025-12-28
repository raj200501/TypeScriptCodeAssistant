import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.cwd());
const dist = path.join(root, 'dist');

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(dist, { recursive: true });
await fs.copyFile(path.join(root, 'index.html'), path.join(dist, 'index.html'));
await copyDir(path.join(root, 'static'), path.join(dist, 'static'));
console.log('Frontend build complete.');
