import { AnalysisEngine } from '@tca/analysis-engine';
import { AnalyzeRequest, AnalyzeResponse } from '@tca/shared';

const engine = new AnalysisEngine();

export const analyzeCode = (code: string) => {
  const result = engine.analyze({ code });
  return result.diagnostics.map((diagnostic) => ({
    codeSnippet: code,
    suggestion: diagnostic.message,
  }));
};

export const analyzeWithEngine = (request: AnalyzeRequest): AnalyzeResponse => {
  return engine.analyze(request);
};

export const applyQuickFix = (request: { code: string; quickFixId: string; fileName?: string }) => {
  return engine.applyQuickFix({
    code: request.code,
    quickFixId: request.quickFixId,
    fileName: request.fileName,
  });
};
