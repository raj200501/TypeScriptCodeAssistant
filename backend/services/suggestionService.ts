import { analyzeCode } from '../utils/codeAnalysis';

export const getSuggestions = async (code: string) => {
  return analyzeCode(code);
};
