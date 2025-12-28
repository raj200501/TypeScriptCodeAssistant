export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TypeScript Code Assistant API',
    version: '0.1.0',
  },
  servers: [{ url: 'http://localhost:5000' }],
  paths: {
    '/api/analyze': {
      post: {
        summary: 'Analyze TypeScript code',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  fileName: { type: 'string' },
                  strict: { type: 'boolean' },
                  rules: { type: 'object', additionalProperties: { type: 'boolean' } },
                },
                required: ['code'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Analysis result',
          },
        },
      },
    },
    '/api/format': {
      post: {
        summary: 'Format code with Prettier',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  parser: { type: 'string' },
                },
                required: ['code'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Formatted output' },
        },
      },
    },
    '/api/refactor': {
      post: {
        summary: 'Apply a quick fix',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  quickFixId: { type: 'string' },
                  fileName: { type: 'string' },
                },
                required: ['code', 'quickFixId'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Updated code' },
        },
      },
    },
    '/api/snippets': {
      get: { summary: 'List snippets', responses: { '200': { description: 'Snippets' } } },
      post: { summary: 'Create snippet', responses: { '201': { description: 'Snippet' } } },
    },
    '/api/snippets/{id}': {
      get: { summary: 'Get snippet', responses: { '200': { description: 'Snippet' } } },
      put: { summary: 'Update snippet', responses: { '200': { description: 'Snippet' } } },
      delete: { summary: 'Delete snippet', responses: { '204': { description: 'Deleted' } } },
    },
    '/api/suggestions': {
      post: { summary: 'Legacy suggestions endpoint', responses: { '200': { description: 'Suggestions' } } },
    },
    '/api/runs': {
      get: { summary: 'List analysis runs', responses: { '200': { description: 'Runs' } } },
    },
  },
};
