import { Request, Response } from 'express';
import {
  createSnippet,
  deleteSnippet,
  getSnippet,
  listAnalyses,
  listSnippets,
  recordAnalysis,
  updateSnippet,
} from '../services/fileDatabase';
import { analyzeCode } from '../utils/codeAnalysis';

const generateId = () => `snip_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

export const createSnippetHandler = async (req: Request, res: Response) => {
  const { title, code, language, tags } = req.body;
  const snippet = await createSnippet({
    id: generateId(),
    title: title || 'Untitled Snippet',
    code: code || '',
    language: language || 'typescript',
    tags: Array.isArray(tags) ? tags : [],
  });
  res.status(201).json(snippet);
};

export const listSnippetsHandler = async (_req: Request, res: Response) => {
  const snippets = await listSnippets();
  res.status(200).json(snippets);
};

export const getSnippetHandler = async (req: Request, res: Response) => {
  const snippet = await getSnippet(req.params.id);
  if (!snippet) {
    res.status(404).json({ message: 'Snippet not found' });
    return;
  }
  res.status(200).json(snippet);
};

export const updateSnippetHandler = async (req: Request, res: Response) => {
  const updated = await updateSnippet(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ message: 'Snippet not found' });
    return;
  }
  res.status(200).json(updated);
};

export const deleteSnippetHandler = async (req: Request, res: Response) => {
  const removed = await deleteSnippet(req.params.id);
  if (!removed) {
    res.status(404).json({ message: 'Snippet not found' });
    return;
  }
  res.status(204).send();
};

export const analyzeSnippetHandler = async (req: Request, res: Response) => {
  const snippet = await getSnippet(req.params.id);
  if (!snippet) {
    res.status(404).json({ message: 'Snippet not found' });
    return;
  }
  const suggestions = analyzeCode(snippet.code);
  const analysis = await recordAnalysis({
    id: generateId(),
    snippetId: snippet.id,
    suggestions,
    createdAt: new Date().toISOString(),
  });
  res.status(200).json(analysis);
};

export const listAnalysesHandler = async (req: Request, res: Response) => {
  const snippetId = req.query.snippetId as string | undefined;
  const analyses = await listAnalyses(snippetId);
  res.status(200).json(analyses);
};
