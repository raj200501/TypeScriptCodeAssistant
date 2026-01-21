import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const args = new Set(process.argv.slice(2));
if (!args.has('--demo')) {
  console.log('Usage: node scripts/demo.mjs --demo');
  process.exit(0);
}

const distPath = path.resolve('packages/analysis-engine/dist/index.js');
if (!fs.existsSync(distPath)) {
  console.error('Demo requires a build. Run: npm run build');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const { AnalysisEngine } = require(distPath);

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tca-demo-'));
const sampleFile = path.join(tmpDir, 'demo.ts');
const sampleCode = 'var count = 1;\nconsole.log(count);\n';
fs.writeFileSync(sampleFile, sampleCode, 'utf-8');

const engine = new AnalysisEngine();
const analysis = engine.analyze({ code: sampleCode, fileName: 'demo.ts' });
const fixId = analysis.diagnostics.flatMap((diag) => diag.quickFixes)[0]?.id;
const updated = engine.applyQuickFix({ code: sampleCode, quickFixId: fixId || '' });

console.log('Demo workspace:', tmpDir);
console.log('Diagnostics:', analysis.diagnostics.map((diag) => diag.message));
console.log('Quick fix result:\n', updated);
