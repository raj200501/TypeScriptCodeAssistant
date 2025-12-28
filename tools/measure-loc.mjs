import { execSync } from 'node:child_process';

const diff = execSync('git diff --stat HEAD~1', { encoding: 'utf8' });
console.log(diff);
