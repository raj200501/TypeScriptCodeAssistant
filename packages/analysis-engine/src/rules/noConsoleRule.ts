import { RuleDefinition } from './types';

export const noConsoleRule: RuleDefinition = {
  id: 'no-console',
  description: 'Warn on console usage in production code.',
  defaultEnabled: true,
  severity: 'warning',
  apply: (context) => {
    const diagnostics = [];
    const regex = /console\.[a-zA-Z]+\s*\(/g;
    let match;
    while ((match = regex.exec(context.code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const range = context.createRange(start, end);
      const fix = context.createFix({
        id: 'remove-console',
        title: 'Remove console statement',
        description: 'Remove console calls or replace with a logger.',
        range,
        newText: '',
        kind: 'quickfix',
      });
      diagnostics.push({
        id: `${context.fileName}:no-console:${start}`,
        message: 'Avoid using console in production code.',
        explanation:
          'Console statements are noisy in production. Use a structured logger and remove debug statements.',
        severity: 'warning' as const,
        range,
        quickFixes: [fix],
      });
    }
    return diagnostics;
  },
};
