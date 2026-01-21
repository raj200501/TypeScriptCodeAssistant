const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const enginePath = path.resolve(__dirname, '../../packages/analysis-engine/dist/index.js');
const { AnalysisEngine } = require(enginePath);

test('analysis engine supports disabling rules via request flags', () => {
  const engine = new AnalysisEngine();
  const result = engine.analyze({
    code: 'var total = 1;',
    rules: {
      'no-var': false,
      'prefer-const': false,
      'no-console': false,
      'no-non-null-assertion': false,
    },
  });
  assert.equal(result.diagnostics.length, 0);
});
