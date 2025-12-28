import { Request, Response } from 'express';
import {
  validateAnalyzeRequest,
  validateFormatRequest,
  validateRefactorRequest,
} from '@tca/shared';
import { analyzeWithEngine, applyQuickFix } from '../utils/codeAnalysis';
import { formatCode } from '../services/formatService';
import { recordAnalysisRun } from '../services/fileDatabase';

export const analyzeHandler = async (req: Request, res: Response) => {
  const parseResult = validateAnalyzeRequest(req.body);
  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid request', issues: parseResult.errors });
    return;
  }

  const analysis = analyzeWithEngine(parseResult.data!);
  await recordAnalysisRun({
    fileName: parseResult.data!.fileName,
    summary: analysis.summary,
  });

  res.status(200).json(analysis);
};

export const formatHandler = (req: Request, res: Response) => {
  const parseResult = validateFormatRequest(req.body);
  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid request', issues: parseResult.errors });
    return;
  }

  const formatted = formatCode(parseResult.data!.code);
  res.status(200).json({ formatted });
};

export const refactorHandler = (req: Request, res: Response) => {
  const parseResult = validateRefactorRequest(req.body);
  if (!parseResult.success) {
    res.status(400).json({ message: 'Invalid request', issues: parseResult.errors });
    return;
  }

  const updatedCode = applyQuickFix(parseResult.data!);
  res.status(200).json({ updatedCode });
};
