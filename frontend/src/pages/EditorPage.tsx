import React, { useEffect, useMemo, useState } from 'react';
import { AnalyzeResponse, QuickFix } from '@tca/shared';
import MonacoEditor from '../components/MonacoEditor';
import DiagnosticsList from '../components/DiagnosticsList';
import QuickFixPreview from '../components/QuickFixPreview';
import AnalysisSummary from '../components/AnalysisSummary';
import { tcaClient } from '../services/tcaClient';
import { useSettings } from '../hooks/useSettings';
import { Badge, Button, Card, PageHeader, Spinner } from '../ui';
import { useToast } from '../ui/Toast';

const defaultCode = `import { useState } from 'react';\n\nvar count = 0;\n\nconsole.log(count);\n\nexport const Counter = () => {\n  const [value, setValue] = useState(count);\n  return <button onClick={() => setValue(value + 1)}>{value}</button>;\n};\n`;

const exampleCode = `import type { FC } from 'react';\n\nconst heading = 'Welcome to TCA';\n\nexport const Banner: FC = () => {\n  const message = heading.trim();\n\n  return (\n    <section>\n      <h1>{message}</h1>\n      <p>Ship better TypeScript with instant insights.</p>\n    </section>\n  );\n};\n`;

function EditorPage() {
  const [code, setCode] = useState(defaultCode);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [selectedFix, setSelectedFix] = useState<QuickFix | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [autoApplied, setAutoApplied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [settings] = useSettings();
  const { websocketEnabled, strict, rules } = settings;
  const { pushToast } = useToast();

  const analysisSummary = analysis?.summary;

  const wsUrl = useMemo(() => {
    const url = new URL(window.location.origin);
    url.port = '5000';
    url.pathname = '/api/stream';
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return url.toString();
  }, []);

  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const autoQuickFix = searchParams.get('quickFix') === '1';

  useEffect(() => {
    if (!websocketEnabled) {
      return undefined;
    }

    const socket = new WebSocket(wsUrl);
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: 'settings',
          payload: { strict, rules },
        })
      );
      socket.send(JSON.stringify({ type: 'analyze', payload: { code, fileName: 'editor.tsx' } }));
    };
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'analysis') {
        setAnalysis(payload.payload);
        setLastUpdated(new Date());
      }
    };

    return () => socket.close();
  }, [code, rules, strict, websocketEnabled, wsUrl]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await tcaClient.analyze({ code, fileName: 'editor.tsx', strict, rules });
      setAnalysis(response);
      setLastUpdated(new Date());
      pushToast({
        title: 'Analysis complete',
        description: `${response.summary.errorCount} errors, ${response.summary.warningCount} warnings`,
        variant: response.summary.errorCount > 0 ? 'warning' : 'success',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runFormat = async () => {
    setIsFormatting(true);
    try {
      const response = await tcaClient.format({ code, parser: 'tsx' });
      setCode(response.formatted);
      pushToast({ title: 'Formatting applied', description: 'Your snippet has been formatted.', variant: 'info' });
    } finally {
      setIsFormatting(false);
    }
  };

  const onSelectQuickFix = async (fix: QuickFix) => {
    setSelectedFix(fix);
    const response = await tcaClient.refactor({
      code,
      quickFixId: fix.id,
      fileName: 'editor.tsx',
    });
    setPreview(response.updatedCode);
  };

  useEffect(() => {
    if (!autoQuickFix || autoApplied || !analysis) {
      return;
    }
    const fix = analysis.diagnostics.flatMap((diag) => diag.quickFixes)[0];
    if (!fix) {
      return;
    }
    setAutoApplied(true);
    onSelectQuickFix(fix);
  }, [analysis, autoApplied, autoQuickFix]);

  const applyQuickFix = () => {
    if (!selectedFix) {
      return;
    }
    setIsApplying(true);
    setCode(preview);
    setSelectedFix(null);
    setPreview('');
    setTimeout(() => setIsApplying(false), 450);
    pushToast({ title: 'Quick fix applied', description: selectedFix.title, variant: 'success' });
  };

  const resetExample = () => {
    setCode(exampleCode);
    setAnalysis(null);
    setSelectedFix(null);
    setPreview('');
  };

  return (
    <div className="page page--editor">
      <PageHeader
        title="Analysis Editor"
        subtitle="Run diagnostics, format, and preview fixes in one polished workspace."
        actions={
          <div className="stack-row">
            <Button variant="outline" onClick={resetExample}>
              Load Example
            </Button>
            <Button variant="secondary" onClick={runFormat} disabled={isFormatting}>
              {isFormatting ? 'Formatting…' : 'Format'}
            </Button>
            <Button variant="primary" onClick={runAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing…' : 'Analyze'}
            </Button>
            <Button variant="ghost" onClick={applyQuickFix} disabled={!selectedFix || isApplying}>
              Apply Fix
            </Button>
          </div>
        }
        meta={
          <div className="editor-meta">
            <Badge variant={websocketEnabled ? 'success' : 'neutral'}>
              WebSocket {websocketEnabled ? 'connected' : 'off'}
            </Badge>
            {lastUpdated && <span>Updated {lastUpdated.toLocaleTimeString()}</span>}
          </div>
        }
      />
      <div className="editor-layout">
        <Card className="editor-pane" title="Workspace" subtitle="TSX, lint, format, and refactor from here.">
          <MonacoEditor value={code} onChange={setCode} />
        </Card>
        <aside className="editor-sidebar">
          <Card title="Analysis Summary" subtitle="Instant signal on severity and totals.">
            <AnalysisSummary summary={analysisSummary} />
          </Card>
          <Card
            title="Diagnostics"
            subtitle="Sorted by severity, with quick fix actions."
            actions={isAnalyzing ? <Spinner size="sm" label="Analyzing" /> : null}
          >
            <DiagnosticsList diagnostics={analysis?.diagnostics ?? []} onSelectQuickFix={onSelectQuickFix} />
          </Card>
        </aside>
      </div>
      <Card
        className="panel panel--diff"
        title="Quick Fix Preview"
        subtitle="Review the change set before applying it to your snippet."
      >
        <QuickFixPreview
          quickFix={selectedFix ?? undefined}
          original={code}
          updated={preview}
          onApply={applyQuickFix}
        />
        {isApplying && <p className="panel-empty">Applying fix…</p>}
      </Card>
    </div>
  );
}

export default EditorPage;
