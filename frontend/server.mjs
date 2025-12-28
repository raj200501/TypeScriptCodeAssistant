import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const useDist = args.includes('--dist');
const root = path.resolve(process.cwd(), useDist ? 'dist' : '.');
const port = 5173;

const serveFile = async (res, filePath, contentType) => {
  try {
    const data = await fs.readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  } catch (error) {
    res.writeHead(404);
    res.end('Not found');
  }
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  if (url.pathname.startsWith('/static/')) {
    const filePath = path.join(root, url.pathname);
    const ext = path.extname(filePath);
    const contentType = ext === '.css' ? 'text/css' : 'application/javascript';
    return serveFile(res, filePath, contentType);
  }
  return serveFile(res, path.join(root, 'index.html'), 'text/html');
});

server.listen(port, () => {
  console.log(`[frontend] running at http://localhost:${port}`);
});
