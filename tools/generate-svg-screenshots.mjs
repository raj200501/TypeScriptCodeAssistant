import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, 'docs', 'screenshots');

const frame = ({ title, body }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1400" height="900" viewBox="0 0 1400 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#EEF2FF" />
      <stop offset="100%" stop-color="#F8FAFC" />
    </linearGradient>
    <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.15" />
    </filter>
  </defs>
  <rect width="1400" height="900" fill="url(#bg)" />
  <rect x="60" y="40" width="1280" height="90" rx="18" fill="#0F172A" />
  <text x="100" y="92" font-size="28" font-family="Inter, sans-serif" fill="#F8FAFC">TypeScript Code Assistant</text>
  <text x="100" y="124" font-size="14" font-family="Inter, sans-serif" fill="#94A3B8">Premium analysis workspace</text>
  <text x="100" y="190" font-size="28" font-family="Inter, sans-serif" fill="#0F172A">${title}</text>
  ${body}
</svg>`;

const editorBody = `
  <rect x="60" y="220" width="880" height="520" rx="20" fill="#0B1120" filter="url(#cardShadow)" />
  <rect x="980" y="220" width="360" height="520" rx="20" fill="#FFFFFF" filter="url(#cardShadow)" />
  <rect x="100" y="260" width="320" height="16" rx="8" fill="#1E293B" />
  <rect x="100" y="290" width="420" height="16" rx="8" fill="#1E293B" />
  <rect x="100" y="320" width="520" height="16" rx="8" fill="#1E293B" />
  <rect x="1020" y="260" width="200" height="16" rx="8" fill="#E2E8F0" />
  <rect x="1020" y="300" width="280" height="80" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="1040" y="340" font-size="12" font-family="Inter, sans-serif" fill="#1D4ED8">NO-VAR</text>
  <text x="1040" y="360" font-size="12" font-family="Inter, sans-serif" fill="#475569">Replace var with const</text>
  <rect x="1020" y="400" width="280" height="80" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="1040" y="440" font-size="12" font-family="Inter, sans-serif" fill="#B45309">PREFER-CONST</text>
  <text x="1040" y="460" font-size="12" font-family="Inter, sans-serif" fill="#475569">Lock in immutable bindings</text>
`;

const diffBody = `
  <rect x="60" y="220" width="600" height="520" rx="20" fill="#FFFFFF" filter="url(#cardShadow)" />
  <rect x="740" y="220" width="600" height="520" rx="20" fill="#FFFFFF" filter="url(#cardShadow)" />
  <text x="100" y="260" font-size="18" font-family="Inter, sans-serif" fill="#0F172A">Before</text>
  <text x="780" y="260" font-size="18" font-family="Inter, sans-serif" fill="#0F172A">After</text>
  <rect x="100" y="300" width="520" height="20" rx="8" fill="#F1F5F9" />
  <rect x="100" y="330" width="480" height="20" rx="8" fill="#F1F5F9" />
  <rect x="100" y="360" width="440" height="20" rx="8" fill="#FEE2E2" />
  <rect x="780" y="300" width="520" height="20" rx="8" fill="#F1F5F9" />
  <rect x="780" y="330" width="480" height="20" rx="8" fill="#DCFCE7" />
  <rect x="780" y="360" width="440" height="20" rx="8" fill="#DCFCE7" />
  <rect x="100" y="420" width="520" height="200" rx="12" fill="#0F172A" />
  <rect x="780" y="420" width="520" height="200" rx="12" fill="#0F172A" />
`;

const snippetsBody = `
  <rect x="60" y="220" width="640" height="520" rx="20" fill="#FFFFFF" filter="url(#cardShadow)" />
  <rect x="740" y="220" width="600" height="520" rx="20" fill="#FFFFFF" filter="url(#cardShadow)" />
  <text x="100" y="260" font-size="18" font-family="Inter, sans-serif" fill="#0F172A">Snippets Library</text>
  <rect x="100" y="300" width="520" height="60" rx="14" fill="#F8FAFC" stroke="#E2E8F0" />
  <rect x="100" y="380" width="520" height="60" rx="14" fill="#F8FAFC" stroke="#E2E8F0" />
  <rect x="100" y="460" width="520" height="60" rx="14" fill="#F8FAFC" stroke="#E2E8F0" />
  <rect x="780" y="260" width="320" height="16" rx="8" fill="#E2E8F0" />
  <rect x="780" y="300" width="480" height="320" rx="16" fill="#0F172A" />
  <text x="100" y="340" font-size="12" font-family="Inter, sans-serif" fill="#475569">useViewport hook</text>
  <text x="100" y="420" font-size="12" font-family="Inter, sans-serif" fill="#475569">authSession guard</text>
  <text x="100" y="500" font-size="12" font-family="Inter, sans-serif" fill="#475569">retryPolicy helper</text>
`;

const historyBody = `
  <rect x="60" y="220" width="1280" height="520" rx="20" fill="#FFFFFF" filter="url(#cardShadow)" />
  <text x="100" y="260" font-size="18" font-family="Inter, sans-serif" fill="#0F172A">Analysis History</text>
  <rect x="100" y="300" width="1200" height="70" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
  <rect x="100" y="390" width="1200" height="70" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
  <rect x="100" y="480" width="1200" height="70" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
  <text x="130" y="340" font-size="12" font-family="Inter, sans-serif" fill="#475569">editor.tsx · 2 errors · 3 warnings</text>
  <text x="130" y="430" font-size="12" font-family="Inter, sans-serif" fill="#475569">snippets.ts · 0 errors · 1 warning</text>
  <text x="130" y="520" font-size="12" font-family="Inter, sans-serif" fill="#475569">settings.ts · 1 error · 0 warnings</text>
`;

const files = [
  { name: 'editor.svg', title: 'Editor Overview', body: editorBody },
  { name: 'diff.svg', title: 'Quick Fix Diff', body: diffBody },
  { name: 'snippets.svg', title: 'Snippets Library', body: snippetsBody },
  { name: 'history.svg', title: 'Analysis History', body: historyBody },
];

const main = async () => {
  await fs.mkdir(outputDir, { recursive: true });
  await Promise.all(
    files.map((file) => fs.writeFile(path.join(outputDir, file.name), frame(file), 'utf8'))
  );
  console.log(`SVG previews written to ${outputDir}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
