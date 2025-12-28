import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import fs from 'node:fs/promises';
import zlib from 'node:zlib';

const root = process.cwd();
const backendPort = 5000;
const frontendPort = 5173;
const screenshotsDir = path.join(root, 'docs', 'screenshots');

const waitForUrl = async (url, attempts = 40) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return;
      }
    } catch (error) {
      // ignore
    }
    await delay(300);
  }
  throw new Error(`Timed out waiting for ${url}`);
};

const startProcess = (command, args, options) => {
  const child = spawn(command, args, {
    ...options,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...options?.env,
    },
  });
  return child;
};

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

const font = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '00001', '11110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00001', '01110'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  ':': ['00000', '00100', '00100', '00000', '00100', '00100', '00000'],
};

const createImage = (width, height, bg) => {
  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = bg[0];
    data[i * 4 + 1] = bg[1];
    data[i * 4 + 2] = bg[2];
    data[i * 4 + 3] = 255;
  }
  return { width, height, data };
};

const drawRect = (image, x, y, w, h, color) => {
  for (let iy = y; iy < y + h; iy += 1) {
    for (let ix = x; ix < x + w; ix += 1) {
      if (ix < 0 || iy < 0 || ix >= image.width || iy >= image.height) continue;
      const idx = (iy * image.width + ix) * 4;
      image.data[idx] = color[0];
      image.data[idx + 1] = color[1];
      image.data[idx + 2] = color[2];
      image.data[idx + 3] = 255;
    }
  }
};

const drawText = (image, text, x, y, color, scale = 2) => {
  const chars = text.toUpperCase().split('');
  let offsetX = x;
  for (const char of chars) {
    const glyph = font[char] || font[' '];
    for (let row = 0; row < glyph.length; row += 1) {
      for (let col = 0; col < glyph[row].length; col += 1) {
        if (glyph[row][col] === '1') {
          drawRect(image, offsetX + col * scale, y + row * scale, scale, scale, color);
        }
      }
    }
    offsetX += (glyph[0].length + 1) * scale;
  }
};

const writePng = async (image, outputPath) => {
  const { width, height, data } = image;
  const raw = Buffer.alloc((width * 4 + 1) * height);
  const buffer = Buffer.from(data);
  for (let y = 0; y < height; y += 1) {
    raw[y * (width * 4 + 1)] = 0;
    buffer.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const chunks = [];
  const pushChunk = (type, chunkData) => {
    const length = Buffer.alloc(4);
    length.writeUInt32BE(chunkData.length, 0);
    const chunkType = Buffer.from(type);
    const crc = Buffer.alloc(4);
    const crcData = Buffer.concat([chunkType, chunkData]);
    crc.writeUInt32BE(crc32(crcData), 0);
    chunks.push(length, chunkType, chunkData, crc);
  };

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  pushChunk('IHDR', ihdr);
  pushChunk('IDAT', zlib.deflateSync(raw));
  pushChunk('IEND', Buffer.alloc(0));

  await fs.writeFile(outputPath, Buffer.concat([signature, ...chunks]));
};

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k += 1) {
      crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const renderScreenshots = async () => {
  await fs.mkdir(screenshotsDir, { recursive: true });

  const editor = createImage(1440, 900, [245, 247, 251]);
  drawRect(editor, 0, 0, 1440, 120, [15, 23, 42]);
  drawText(editor, 'TypeScript Code Assistant', 40, 40, [248, 250, 252], 3);
  drawText(editor, 'Editor - Analysis Results', 40, 160, [31, 41, 68], 2);
  drawRect(editor, 40, 220, 900, 520, [11, 17, 32]);
  drawRect(editor, 980, 220, 420, 520, [255, 255, 255]);
  drawText(editor, 'Diagnostics', 1000, 250, [31, 41, 68], 2);
  drawRect(editor, 1000, 300, 380, 120, [248, 250, 252]);
  drawText(editor, 'NO-VAR', 1020, 330, [37, 99, 235], 2);
  await writePng(editor, path.join(screenshotsDir, 'editor-analysis.png'));

  const quickFix = createImage(1440, 900, [245, 247, 251]);
  drawRect(quickFix, 0, 0, 1440, 120, [15, 23, 42]);
  drawText(quickFix, 'TypeScript Code Assistant', 40, 40, [248, 250, 252], 3);
  drawText(quickFix, 'Quick Fix Preview', 40, 160, [31, 41, 68], 2);
  drawRect(quickFix, 40, 220, 660, 520, [255, 255, 255]);
  drawRect(quickFix, 740, 220, 660, 520, [255, 255, 255]);
  drawText(quickFix, 'Before', 70, 250, [31, 41, 68], 2);
  drawText(quickFix, 'After', 770, 250, [31, 41, 68], 2);
  await writePng(quickFix, path.join(screenshotsDir, 'editor-quick-fix.png'));

  const snippets = createImage(1440, 900, [245, 247, 251]);
  drawRect(snippets, 0, 0, 1440, 120, [15, 23, 42]);
  drawText(snippets, 'TypeScript Code Assistant', 40, 40, [248, 250, 252], 3);
  drawText(snippets, 'Snippets Library', 40, 160, [31, 41, 68], 2);
  drawRect(snippets, 40, 220, 600, 520, [255, 255, 255]);
  drawRect(snippets, 700, 220, 700, 520, [255, 255, 255]);
  drawText(snippets, 'Saved Snippets', 70, 250, [31, 41, 68], 2);
  drawText(snippets, 'History', 730, 250, [31, 41, 68], 2);
  await writePng(snippets, path.join(screenshotsDir, 'snippets-library.png'));
};

const main = async () => {
  await runBuild();

  const backend = startProcess('npm', ['run', 'dev', '--workspace', 'backend'], {
    cwd: root,
    env: { PORT: backendPort },
  });

  const frontend = startProcess('npm', ['run', 'dev', '--workspace', 'frontend'], {
    cwd: root,
    env: { PORT: frontendPort },
  });

  try {
    await waitForUrl(`http://localhost:${backendPort}/health`);
    await waitForUrl(`http://localhost:${frontendPort}`);
    await renderScreenshots();
  } finally {
    backend.kill('SIGTERM');
    frontend.kill('SIGTERM');
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
