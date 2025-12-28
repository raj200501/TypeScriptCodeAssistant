import { tcaClient } from './tcaClient';

export const fetchSuggestions = async (code: string) => {
  const response = await tcaClient.analyze({ code });
  return response.diagnostics.map((diagnostic) => ({
    suggestion: diagnostic.message,
    codeSnippet: code,
  }));
};
