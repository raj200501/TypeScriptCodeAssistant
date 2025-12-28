import { RuleDefinition } from './types';

export const noNonNullAssertionRule: RuleDefinition = {
  id: 'no-non-null-assertion',
  description: 'Discourage non-null assertions.',
  defaultEnabled: true,
  severity: 'warning',
  apply: (context) => {
    const diagnostics = [];
    const regex = /\b\w+!\b/g;
    let match;
    while ((match = regex.exec(context.code)) !== null) {
      const start = match.index + match[0].length - 1;
      const end = start + 1;
      const range = context.createRange(start, end);
      diagnostics.push({
        id: `${context.fileName}:no-non-null:${start}`,
        message: 'Avoid non-null assertions (!).',
        explanation:
          'Non-null assertions bypass type safety. Prefer explicit checks or optional chaining.',
        severity: 'warning' as const,
        range,
        quickFixes: [],
      });
    }
    return diagnostics;
  },
};
