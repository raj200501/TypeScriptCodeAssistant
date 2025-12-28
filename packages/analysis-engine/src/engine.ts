import { AnalyzeRequest, AnalyzeResponse, Diagnostic, QuickFix, RefactorRequest } from '@tca/shared';
import { rangeFromIndex } from './utils/range';
import { RuleDefinition, RuleDiagnostic } from './rules/types';
import { noVarRule } from './rules/noVarRule';
import { preferConstRule } from './rules/preferConstRule';
import { noConsoleRule } from './rules/noConsoleRule';
import { noNonNullAssertionRule } from './rules/noNonNullAssertionRule';

export interface AnalysisEngineOptions {
  rules?: RuleDefinition[];
}

export class AnalysisEngine {
  private rules: RuleDefinition[];

  constructor(options: AnalysisEngineOptions = {}) {
    this.rules = options.rules ?? [noVarRule, preferConstRule, noConsoleRule, noNonNullAssertionRule];
  }

  public analyze(request: AnalyzeRequest): AnalyzeResponse {
    const fileName = request.fileName ?? 'analysis.ts';
    const diagnostics: Diagnostic[] = [];
    const enabledRules = new Set(
      this.rules
        .filter((rule) => request.rules?.[rule.id] ?? rule.defaultEnabled)
        .map((rule) => rule.id),
    );

    const context = {
      code: request.code,
      fileName,
      strict: request.strict ?? true,
      createRange: (start: number, end: number) => rangeFromIndex(request.code, start, end),
      createFix: (options: {
        id: string;
        title: string;
        description: string;
        range: ReturnType<typeof rangeFromIndex>;
        newText: string;
        kind?: 'refactor' | 'quickfix' | 'format';
      }): QuickFix => ({
        id: options.id,
        title: options.title,
        description: options.description,
        edits: [{ range: options.range, newText: options.newText }],
        kind: options.kind ?? 'quickfix',
      }),
    };

    for (const rule of this.rules) {
      if (!enabledRules.has(rule.id)) {
        continue;
      }
      const results: RuleDiagnostic[] = rule.apply(context);
      diagnostics.push(
        ...results.map((result) => ({
          id: result.id,
          severity: result.severity,
          ruleId: rule.id,
          message: result.message,
          explanation: result.explanation,
          range: result.range,
          quickFixes: result.quickFixes,
        })),
      );
    }

    const summary = diagnostics.reduce<AnalyzeResponse['summary']>(
      (acc, diagnostic: Diagnostic) => {
        acc.errorCount += diagnostic.severity === 'error' ? 1 : 0;
        acc.warningCount += diagnostic.severity === 'warning' ? 1 : 0;
        acc.infoCount += diagnostic.severity === 'info' ? 1 : 0;
        return acc;
      },
      { errorCount: 0, warningCount: 0, infoCount: 0 },
    );

    return { diagnostics, summary };
  }

  public applyQuickFix(request: RefactorRequest): string {
    const analysis = this.analyze({
      code: request.code,
      fileName: request.fileName,
      strict: true,
    });
    const quickFix = analysis.diagnostics
      .flatMap((diagnostic: Diagnostic) => diagnostic.quickFixes)
      .find((fix: QuickFix) => fix.id === request.quickFixId);

    if (!quickFix) {
      return request.code;
    }

    return applyEdits(request.code, quickFix.edits);
  }
}

export const applyEdits = (code: string, edits: QuickFix['edits']): string => {
  const lines = code.split('\n');
  const sorted = [...edits].sort((a, b) => {
    if (a.range.start.line !== b.range.start.line) {
      return b.range.start.line - a.range.start.line;
    }
    return b.range.start.column - a.range.start.column;
  });

  for (const edit of sorted) {
    const startLine = edit.range.start.line;
    const endLine = edit.range.end.line;
    const startCol = edit.range.start.column;
    const endCol = edit.range.end.column;

    if (startLine === endLine) {
      const line = lines[startLine] ?? '';
      lines[startLine] = `${line.slice(0, startCol)}${edit.newText}${line.slice(endCol)}`;
      continue;
    }

    const prefix = (lines[startLine] ?? '').slice(0, startCol);
    const suffix = (lines[endLine] ?? '').slice(endCol);
    lines.splice(startLine, endLine - startLine + 1, `${prefix}${edit.newText}${suffix}`);
  }

  return lines.join('\n');
};
