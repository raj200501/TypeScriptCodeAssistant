const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const enginePath = path.resolve(__dirname, '../../packages/analysis-engine/dist/index.js');
const { AnalysisEngine } = require(enginePath);

test('analysis engine reports diagnostics', () => {
  const engine = new AnalysisEngine();
  const result = engine.analyze({ code: 'var count = 1;' });
  const hasNoVar = result.diagnostics.some((diag) => diag.ruleId === 'no-var');
  assert.equal(hasNoVar, true);
});

test('analysis engine applies quick fixes', () => {
  const engine = new AnalysisEngine();
  const code = 'var value = 2;';
  const result = engine.analyze({ code });
  const fixId = result.diagnostics.flatMap((diag) => diag.quickFixes)[0]?.id;
  const updated = engine.applyQuickFix({ code, quickFixId: fixId || '' });
  assert.ok(updated.includes('let value'));
});
