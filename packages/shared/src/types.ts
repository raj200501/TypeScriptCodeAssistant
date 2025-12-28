export type DiagnosticSeverity = 'info' | 'warning' | 'error';

export interface Position {
  line: number;
  column: number;
}

export interface TextRange {
  start: Position;
  end: Position;
}

export interface TextEdit {
  range: TextRange;
  newText: string;
}

export interface QuickFix {
  id: string;
  title: string;
  description: string;
  edits: TextEdit[];
  kind: 'refactor' | 'quickfix' | 'format';
}

export interface Diagnostic {
  id: string;
  severity: DiagnosticSeverity;
  ruleId: string;
  message: string;
  explanation: string;
  range: TextRange;
  quickFixes: QuickFix[];
}

export interface AnalyzeRequest {
  code: string;
  fileName?: string;
  rules?: Record<string, boolean>;
  strict?: boolean;
}

export interface AnalyzeResponse {
  diagnostics: Diagnostic[];
  summary: {
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
}

export interface FormatRequest {
  code: string;
  parser?: 'typescript' | 'tsx' | 'babel';
}

export interface FormatResponse {
  formatted: string;
}

export interface RefactorRequest {
  code: string;
  quickFixId: string;
  fileName?: string;
}

export interface RefactorResponse {
  updatedCode: string;
}

export interface Snippet {
  id: string;
  title: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisRun {
  id: string;
  createdAt: string;
  fileName?: string;
  summary: AnalyzeResponse['summary'];
}
