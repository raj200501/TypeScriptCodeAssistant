import { RuleDefinition } from './types';

export const preferConstRule: RuleDefinition = {
  id: 'prefer-const',
  description: 'Suggest const when a let variable is never reassigned.',
  defaultEnabled: true,
  severity: 'info',
  apply: (context) => {
    const diagnostics = [];
    const regex = /\blet\b/g;
    let match;
    while ((match = regex.exec(context.code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const range = context.createRange(start, end);
      const fix = context.createFix({
        id: 'replace-let-with-const',
        title: 'Replace let with const',
        description: 'Use const when variables are not reassigned.',
        range,
        newText: 'const',
        kind: 'quickfix',
      });
      diagnostics.push({
        id: `${context.fileName}:prefer-const:${start}`,
        message: 'This variable is never reassigned; use const instead.',
        explanation:
          'Using const communicates intent and prevents accidental reassignment for variables that never change.',
        severity: 'info' as const,
        range,
        quickFixes: [fix],
      });
    }
    return diagnostics;
  },
};
