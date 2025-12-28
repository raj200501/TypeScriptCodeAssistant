import { promises as fs } from 'fs';
import path from 'path';

export interface StoredSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredAnalysis {
  id: string;
  snippetId: string;
  suggestions: { suggestion: string; codeSnippet: string }[];
  createdAt: string;
}

interface DatabaseShape {
  snippets: StoredSnippet[];
  analyses: StoredAnalysis[];
}

const databasePath = path.join(__dirname, '..', 'data', 'store.json');

const ensureDatabase = async () => {
  try {
    await fs.access(databasePath);
  } catch (error) {
    const initialData: DatabaseShape = { snippets: [], analyses: [] };
    await fs.mkdir(path.dirname(databasePath), { recursive: true });
    await fs.writeFile(databasePath, JSON.stringify(initialData, null, 2));
  }
};

export const readDatabase = async (): Promise<DatabaseShape> => {
  await ensureDatabase();
  const raw = await fs.readFile(databasePath, 'utf-8');
  return JSON.parse(raw) as DatabaseShape;
};

export const writeDatabase = async (data: DatabaseShape) => {
  await fs.writeFile(databasePath, JSON.stringify(data, null, 2));
};

export const createSnippet = async (snippet: Omit<StoredSnippet, 'createdAt' | 'updatedAt'>) => {
  const db = await readDatabase();
  const now = new Date().toISOString();
  const record: StoredSnippet = {
    ...snippet,
    createdAt: now,
    updatedAt: now,
  };
  db.snippets.push(record);
  await writeDatabase(db);
  return record;
};

export const listSnippets = async () => {
  const db = await readDatabase();
  return db.snippets;
};

export const getSnippet = async (id: string) => {
  const db = await readDatabase();
  return db.snippets.find((item) => item.id === id);
};

export const updateSnippet = async (id: string, updates: Partial<Omit<StoredSnippet, 'id' | 'createdAt'>>) => {
  const db = await readDatabase();
  const index = db.snippets.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const existing = db.snippets[index];
  const updated: StoredSnippet = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  db.snippets[index] = updated;
  await writeDatabase(db);
  return updated;
};

export const deleteSnippet = async (id: string) => {
  const db = await readDatabase();
  const remaining = db.snippets.filter((item) => item.id !== id);
  const removed = db.snippets.length !== remaining.length;
  db.snippets = remaining;
  await writeDatabase(db);
  return removed;
};

export const recordAnalysis = async (analysis: StoredAnalysis) => {
  const db = await readDatabase();
  db.analyses.push(analysis);
  await writeDatabase(db);
  return analysis;
};

export const listAnalyses = async (snippetId?: string) => {
  const db = await readDatabase();
  if (!snippetId) {
    return db.analyses;
  }
  return db.analyses.filter((analysis) => analysis.snippetId === snippetId);
};
