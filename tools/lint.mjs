import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ignoreDirs = new Set(['node_modules', 'dist', '.git', 'docs/screenshots']);
const textFileExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.yml',
  '.yaml',
  '.css',
  '.html',
  '.sh',
]);

const jsonFiles = ['package.json', 'tsconfig.json', 'tsconfig.base.json'];

let hasError = false;

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(root, fullPath);

    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name) || relPath.startsWith('docs/screenshots')) {
        continue;
      }
      await walk(fullPath);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!textFileExtensions.has(ext)) {
      continue;
    }

    const contents = await fs.readFile(fullPath, 'utf8');

    if (contents.includes('\r\n')) {
      report(relPath, 'CRLF line endings detected; use LF.');
    }

    const trailingWhitespace = contents.split('\n').findIndex((line) => /[ \t]+$/.test(line));
    if (trailingWhitespace !== -1) {
      report(relPath, `Trailing whitespace found on line ${trailingWhitespace + 1}.`);
    }

    if (ext === '.json' || jsonFiles.includes(entry.name)) {
      try {
        JSON.parse(contents);
      } catch (error) {
        report(relPath, `Invalid JSON: ${error.message}`);
      }
    }
  }
};

const report = (file, message) => {
  hasError = true;
  console.error(`[lint] ${file}: ${message}`);
};

await walk(root);

if (hasError) {
  process.exit(1);
}

console.log('Lint checks passed.');
