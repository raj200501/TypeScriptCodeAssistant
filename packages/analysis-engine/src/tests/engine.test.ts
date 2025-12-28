import { describe, expect, it } from 'vitest';
import { AnalysisEngine } from '../engine';

describe('AnalysisEngine', () => {
  it('returns diagnostics for var usage', () => {
    const engine = new AnalysisEngine();
    const result = engine.analyze({ code: 'var name = "test";' });
    expect(result.diagnostics.some((diag) => diag.ruleId === 'no-var')).toBe(true);
  });

  it('applies quick fixes', () => {
    const engine = new AnalysisEngine();
    const code = 'var count = 1;';
    const result = engine.analyze({ code });
    const fixId = result.diagnostics.flatMap((d) => d.quickFixes)[0]?.id;
    const updated = engine.applyQuickFix({ code, quickFixId: fixId ?? '' });
    expect(updated).toContain('let count');
  });
});
