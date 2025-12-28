import { access, rm } from 'node:fs/promises';
import path from 'node:path';

const screenshots = [
  'docs/screenshots/editor-analysis.png',
  'docs/screenshots/editor-quick-fix.png',
  'docs/screenshots/snippets-library.png',
];

const root = process.cwd();

const main = async () => {
  for (const file of screenshots) {
    await access(path.resolve(root, file));
  }

  await rm(path.resolve(root, 'docs', 'screenshots'), { recursive: true, force: true });
  console.log('Screenshots generated and cleaned.');
};

main().catch((error) => {
  console.error(`Screenshot verification failed: ${error.message}`);
  process.exit(1);
});
