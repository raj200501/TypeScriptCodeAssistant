const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const net = require('node:net');

const getFreePort = () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });

const waitFor = async (url, attempts = 30) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch (error) {
      // ignore
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`Timed out waiting for ${url}`);
};

test('metrics endpoint responds when enabled', async () => {
  const port = await getFreePort();
  const server = spawn('node', ['backend/dist/server-verified.js'], {
    env: { ...process.env, PORT: String(port), ENABLE_METRICS: '1' },
    stdio: 'inherit',
  });

  try {
    await waitFor(`http://localhost:${port}/health`);
    const metrics = await fetch(`http://localhost:${port}/metrics`);
    assert.equal(metrics.ok, true);
    const body = await metrics.text();
    assert.ok(body.includes('tca_http_request_duration_ms_count'));
  } finally {
    server.kill('SIGTERM');
  }
});
