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

test('backend endpoints respond', async () => {
  const port = await getFreePort();
  const server = spawn('node', ['backend/dist/server-verified.js'], {
    env: { ...process.env, PORT: String(port) },
    stdio: 'inherit',
  });

  try {
    await waitFor(`http://localhost:${port}/health`);

    const suggestions = await fetch(`http://localhost:${port}/api/suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'const x = 1;' }),
    });
    assert.equal(suggestions.ok, true);
    const suggestionBody = await suggestions.json();
    assert.ok(Array.isArray(suggestionBody.suggestions));

    const snippetCreate = await fetch(`http://localhost:${port}/api/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Integration snippet',
        code: 'const greet = () => "hi";\n',
        language: 'typescript',
        tags: ['integration'],
      }),
    });
    assert.equal(snippetCreate.ok, true);
    const snippet = await snippetCreate.json();
    assert.ok(snippet.id);

    const snippetGet = await fetch(`http://localhost:${port}/api/snippets/${snippet.id}`);
    assert.equal(snippetGet.ok, true);
  } finally {
    server.kill('SIGTERM');
  }
});
