import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const rootDir = join(__dirname, '..', 'frontend', 'public');

const PORT = process.env.PREVIEW_PORT || 4173;

const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  if (req.url.startsWith('/api/suggestions')) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const payload = body ? JSON.parse(body) : { code: '' };
      const suggestions = [
        {
          codeSnippet: payload.code || '',
          suggestion: 'Consider using a more descriptive variable name.',
        },
        {
          codeSnippet: payload.code || '',
          suggestion: 'Refactor this code into a separate function.',
        },
      ];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(suggestions));
    });
    return;
  }

  const routeMap = {
    '/': '/preview.html',
    '/preview-dashboard': '/preview-dashboard.html',
    '/preview-workflows': '/preview-workflows.html',
    '/preview-insights': '/preview-insights.html',
  };
  const urlPath = routeMap[req.url] || req.url;
  const filePath = join(rootDir, urlPath);

  try {
    const file = await readFile(filePath);
    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
    res.end(file);
  } catch (error) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
});
