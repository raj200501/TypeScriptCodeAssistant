import { spawn } from 'node:child_process';

const commands = [
  {
    name: 'backend',
    cmd: 'npm',
    args: ['run', 'dev', '--workspace', 'backend'],
  },
  {
    name: 'frontend',
    cmd: 'npm',
    args: ['run', 'dev', '--workspace', 'frontend'],
  },
];

const children = commands.map(({ cmd, args, name }) => {
  const child = spawn(cmd, args, { stdio: 'inherit', env: process.env });
  child.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`);
    }
  });
  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT');
    }
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
