import { analyzeCode } from '../utils/codeAnalysis';

export const getSuggestions = async (code: string) => {
    // Perform code analysis and generate suggestions
    return analyzeCode(code);
};
