import { DiagnosticSeverity, QuickFix, TextRange } from '@tca/shared';

export interface RuleContext {
  code: string;
  fileName: string;
  strict: boolean;
  createRange: (start: number, end: number) => TextRange;
  createFix: (options: {
    id: string;
    title: string;
    description: string;
    range: TextRange;
    newText: string;
    kind?: 'refactor' | 'quickfix' | 'format';
  }) => QuickFix;
}

export interface RuleDiagnostic {
  id: string;
  message: string;
  explanation: string;
  severity: DiagnosticSeverity;
  range: TextRange;
  quickFixes: QuickFix[];
}

export interface RuleDefinition {
  id: string;
  description: string;
  defaultEnabled: boolean;
  severity: DiagnosticSeverity;
  apply: (context: RuleContext) => RuleDiagnostic[];
}
