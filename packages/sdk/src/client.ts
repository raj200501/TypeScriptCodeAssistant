import {
  AnalyzeRequest,
  AnalyzeResponse,
  FormatRequest,
  FormatResponse,
  RefactorRequest,
  RefactorResponse,
  Snippet,
  AnalysisRun,
} from '@tca/shared';

export interface ClientOptions {
  baseUrl?: string;
  fetcher?: typeof fetch;
}

export class TcaClient {
  private baseUrl: string;
  private fetcher: typeof fetch;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'http://localhost:3001';
    this.fetcher = options.fetcher ?? fetch;
  }

  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    return this.request('/api/analyze', request);
  }

  async format(request: FormatRequest): Promise<FormatResponse> {
    return this.request('/api/format', request);
  }

  async refactor(request: RefactorRequest): Promise<RefactorResponse> {
    return this.request('/api/refactor', request);
  }

  async listSnippets(): Promise<Snippet[]> {
    return this.request('/api/snippets', undefined, 'GET');
  }

  async createSnippet(snippet: Pick<Snippet, 'title' | 'code'>): Promise<Snippet> {
    return this.request('/api/snippets', snippet);
  }

  async updateSnippet(id: string, snippet: Pick<Snippet, 'title' | 'code'>): Promise<Snippet> {
    return this.request(`/api/snippets/${id}`, snippet, 'PUT');
  }

  async deleteSnippet(id: string): Promise<{ id: string }> {
    return this.request(`/api/snippets/${id}`, undefined, 'DELETE');
  }

  async listRuns(): Promise<AnalysisRun[]> {
    return this.request('/api/runs', undefined, 'GET');
  }

  private async request<T>(
    path: string,
    body?: unknown,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  ): Promise<T> {
    const response = await this.fetcher(`${this.baseUrl}${path}`.replace(/\/$/, ''), {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === 'GET' || method === 'DELETE' ? undefined : JSON.stringify(body ?? {}),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} ${text}`);
    }

    return (await response.json()) as T;
  }
}
