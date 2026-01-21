import { analyzeWithEngine, applyQuickFix, analyzeCode } from './utils/codeAnalysis';
import { formatCode } from './services/formatService';
import {
  createSnippet,
  deleteSnippet,
  getSnippet,
  listAnalyses,
  listSnippets,
  listAnalysisRuns,
  recordAnalysis,
  recordAnalysisRun,
  updateSnippet,
} from './services/fileDatabase';
import { openApiSpec } from './openapi';
import { logger } from './utils/logger';
import { createMetricsRegistry } from './utils/metrics';
import { maybeInitOtel } from './utils/otel';
import crypto from 'crypto';

const rateState = new Map<string, { count: number; resetAt: number }>();

const jsonResponse = (res: any, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const readJson = async (req: any) => {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Uint8Array);
  }
  const raw = Buffer.concat(chunks).toString('utf-8');
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
};

const rateLimit = (ip: string, limit = 120, windowMs = 60_000) => {
  const now = Date.now();
  const entry = rateState.get(ip);
  if (!entry || entry.resetAt <= now) {
    rateState.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
};

export const createRequestListener = () => {
  const metricsRegistry = process.env.ENABLE_METRICS === '1' ? createMetricsRegistry() : null;
  maybeInitOtel({ serviceName: 'tca-backend' });

  return async (req: any, res: any) => {
    const requestId = crypto.randomUUID();
    const url = new URL(req.url ?? '/', 'http://localhost');
    const pathname = url.pathname;
    const method = req.method ?? 'GET';
    const startTime = metricsRegistry ? process.hrtime.bigint() : null;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Request-Id');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('x-request-id', requestId);
    if (metricsRegistry && startTime) {
      res.on('finish', () => {
        const durationMs = Number(process.hrtime.bigint() - startTime) / 1_000_000;
        metricsRegistry.observeDuration('http_request', durationMs, {
          method,
          path: pathname,
          status: res.statusCode,
        });
      });
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    const ip = req.socket?.remoteAddress ?? 'unknown';
    if (rateLimit(ip)) {
      jsonResponse(res, 429, { message: 'Rate limit exceeded' });
      return;
    }

    logger.info({ requestId, method: req.method, path: pathname }, 'request');

    try {
      if (metricsRegistry && req.method === 'GET' && pathname === '/metrics') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain; version=0.0.4');
        res.end(metricsRegistry.render());
        return;
      }

      if (req.method === 'GET' && pathname === '/health') {
        return jsonResponse(res, 200, { status: 'ok' });
      }

      if (req.method === 'GET' && pathname === '/api/openapi.json') {
        return jsonResponse(res, 200, openApiSpec);
      }

      if (req.method === 'POST' && pathname === '/api/suggestions') {
        const body = await readJson(req);
        if (!body.code) {
          return jsonResponse(res, 400, { message: 'code is required' });
        }
        const suggestions = analyzeCode(body.code);
        return jsonResponse(res, 200, { suggestions });
      }

      if (req.method === 'POST' && pathname === '/api/analyze') {
        const body = await readJson(req);
        if (!body.code) {
          return jsonResponse(res, 400, { message: 'code is required' });
        }
        const analysis = analyzeWithEngine(body);
        await recordAnalysisRun({ fileName: body.fileName, summary: analysis.summary });
        return jsonResponse(res, 200, analysis);
      }

      if (req.method === 'POST' && pathname === '/api/format') {
        const body = await readJson(req);
        if (!body.code) {
          return jsonResponse(res, 400, { message: 'code is required' });
        }
        const formatted = formatCode(body.code);
        return jsonResponse(res, 200, { formatted });
      }

      if (req.method === 'POST' && pathname === '/api/refactor') {
        const body = await readJson(req);
        if (!body.code || !body.quickFixId) {
          return jsonResponse(res, 400, { message: 'code and quickFixId are required' });
        }
        const updatedCode = applyQuickFix(body);
        return jsonResponse(res, 200, { updatedCode });
      }

      if (req.method === 'GET' && pathname === '/api/snippets') {
        const snippets = await listSnippets();
        return jsonResponse(res, 200, snippets);
      }

      if (req.method === 'POST' && pathname === '/api/snippets') {
        const body = await readJson(req);
        const snippet = await createSnippet({
          id: `snip_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          title: body.title || 'Untitled Snippet',
          code: body.code || '',
          language: body.language || 'typescript',
          tags: Array.isArray(body.tags) ? body.tags : [],
        });
        return jsonResponse(res, 201, snippet);
      }

      const snippetMatch = pathname.match(/^\/api\/snippets\/([^/]+)$/);
      if (snippetMatch) {
        const snippetId = snippetMatch[1];
        if (req.method === 'GET') {
          const snippet = await getSnippet(snippetId);
          if (!snippet) {
            return jsonResponse(res, 404, { message: 'Snippet not found' });
          }
          return jsonResponse(res, 200, snippet);
        }
        if (req.method === 'PUT') {
          const body = await readJson(req);
          const updated = await updateSnippet(snippetId, body);
          if (!updated) {
            return jsonResponse(res, 404, { message: 'Snippet not found' });
          }
          return jsonResponse(res, 200, updated);
        }
        if (req.method === 'DELETE') {
          const removed = await deleteSnippet(snippetId);
          if (!removed) {
            return jsonResponse(res, 404, { message: 'Snippet not found' });
          }
          res.statusCode = 204;
          res.end();
          return;
        }
      }

      const analyzeMatch = pathname.match(/^\/api\/snippets\/([^/]+)\/analyze$/);
      if (analyzeMatch && req.method === 'POST') {
        const snippetId = analyzeMatch[1];
        const snippet = await getSnippet(snippetId);
        if (!snippet) {
          return jsonResponse(res, 404, { message: 'Snippet not found' });
        }
        const suggestions = analyzeCode(snippet.code);
        const analysis = await recordAnalysis({
          id: `analysis_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          snippetId: snippet.id,
          suggestions,
          createdAt: new Date().toISOString(),
        });
        return jsonResponse(res, 200, analysis);
      }

      if (req.method === 'GET' && pathname === '/api/analyses') {
        const snippetId = url.searchParams.get('snippetId') ?? undefined;
        const analyses = await listAnalyses(snippetId);
        return jsonResponse(res, 200, analyses);
      }

      if (req.method === 'GET' && pathname === '/api/runs') {
        const runs = await listAnalysisRuns();
        return jsonResponse(res, 200, runs);
      }

      jsonResponse(res, 404, { message: 'Not found' });
    } catch (error) {
      logger.error({ requestId, error: String(error) }, 'request_error');
      jsonResponse(res, 500, { message: 'Server error' });
    }
  };
};
