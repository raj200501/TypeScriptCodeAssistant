import { spawn } from 'node:child_process';

const runBuild = () => {
  return new Promise((resolve, reject) => {
    const build = spawn('npm', ['run', 'build'], { stdio: 'inherit', env: process.env });
    build.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`build exited with code ${code}`));
      }
    });
  });
};

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

await runBuild();

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
