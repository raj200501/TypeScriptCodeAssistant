import { describe, expect, it } from 'vitest';
import { createSnippet, listSnippets } from './services/fileDatabase';

describe('fileDatabase', () => {
  it('creates snippets', async () => {
    const snippet = await createSnippet({
      id: `test_${Date.now()}`,
      title: 'Test',
      code: 'const x = 1;',
      language: 'typescript',
      tags: [],
    });
    const snippets = await listSnippets();
    expect(snippets.find((item) => item.id === snippet.id)).toBeTruthy();
  });
});
