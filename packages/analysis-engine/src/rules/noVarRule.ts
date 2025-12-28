import { RuleDefinition } from './types';

export const noVarRule: RuleDefinition = {
  id: 'no-var',
  description: 'Disallow var declarations in favor of let or const.',
  defaultEnabled: true,
  severity: 'warning',
  apply: (context) => {
    const diagnostics = [];
    const regex = /\bvar\b/g;
    let match;
    while ((match = regex.exec(context.code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const range = context.createRange(start, end);
      const fix = context.createFix({
        id: 'replace-var-with-let',
        title: 'Replace var with let',
        description: 'Use let for block-scoped variables.',
        range,
        newText: 'let',
        kind: 'quickfix',
      });
      diagnostics.push({
        id: `${context.fileName}:no-var:${start}`,
        message: 'Avoid using var; use let or const instead.',
        explanation:
          'var is function-scoped and can lead to unexpected behavior. let and const are block-scoped and safer.',
        severity: 'warning' as const,
        range,
        quickFixes: [fix],
      });
    }
    return diagnostics;
  },
};
