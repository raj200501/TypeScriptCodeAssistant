const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const enginePath = path.resolve(__dirname, '../../packages/analysis-engine/dist/index.js');
const { applyEdits } = require(enginePath);

test('applyEdits applies multiple edits on a single line', () => {
  const code = 'let count = 1;';
  const edits = [
    {
      range: { start: { line: 0, column: 4 }, end: { line: 0, column: 9 } },
      newText: 'total',
    },
    {
      range: { start: { line: 0, column: 12 }, end: { line: 0, column: 13 } },
      newText: '2',
    },
  ];
  const updated = applyEdits(code, edits);
  assert.equal(updated, 'let total = 2;');
});

test('applyEdits can replace a multi-line span', () => {
  const code = 'const one = 1;\nconst two = 2;';
  const edits = [
    {
      range: { start: { line: 0, column: 6 }, end: { line: 1, column: 6 } },
      newText: 'combined ',
    },
  ];
  const updated = applyEdits(code, edits);
  assert.equal(updated, 'const combined two = 2;');
});
