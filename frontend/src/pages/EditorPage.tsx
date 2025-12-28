import React, { useEffect, useMemo, useState } from 'react';
import { AnalyzeResponse, QuickFix } from '@tca/shared';
import MonacoEditor from '../components/MonacoEditor';
import DiagnosticsList from '../components/DiagnosticsList';
import QuickFixPreview from '../components/QuickFixPreview';
import AnalysisSummary from '../components/AnalysisSummary';
import { tcaClient } from '../services/tcaClient';
import { useSettings } from '../hooks/useSettings';

const defaultCode = `import { useState } from 'react';\n\nvar count = 0;\n\nconsole.log(count);\n\nexport const Counter = () => {\n  const [value, setValue] = useState(count);\n  return <button onClick={() => setValue(value + 1)}>{value}</button>;\n};\n`;

function EditorPage() {
  const [code, setCode] = useState(defaultCode);
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [selectedFix, setSelectedFix] = useState<QuickFix | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [autoApplied, setAutoApplied] = useState(false);
  const [settings] = useSettings();
  const { websocketEnabled, strict, rules } = settings;

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
        }),
      );
      socket.send(JSON.stringify({ type: 'analyze', payload: { code, fileName: 'editor.tsx' } }));
    };
    socket.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === 'analysis') {
        setAnalysis(payload.payload);
      }
    };

    return () => socket.close();
  }, [code, rules, strict, websocketEnabled, wsUrl]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await tcaClient.analyze({ code, fileName: 'editor.tsx', strict, rules });
      setAnalysis(response);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runFormat = async () => {
    const response = await tcaClient.format({ code, parser: 'tsx' });
    setCode(response.formatted);
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
    setIsApplying(false);
  };

  return (
    <div className="page page--editor">
      <div className="editor-toolbar">
        <button className="button button--primary" onClick={runAnalysis} disabled={isAnalyzing}>
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
        <button className="button button--secondary" onClick={runFormat}>
          Format
        </button>
        <span className="status-pill">WebSocket: {websocketEnabled ? 'on' : 'off'}</span>
      </div>
      <div className="editor-layout">
        <div className="editor-pane">
          <MonacoEditor value={code} onChange={setCode} />
        </div>
        <aside className="editor-sidebar">
          <AnalysisSummary summary={analysisSummary} />
          <DiagnosticsList diagnostics={analysis?.diagnostics ?? []} onSelectQuickFix={onSelectQuickFix} />
        </aside>
      </div>
      <section className="panel">
        <h2>Quick Fix Preview</h2>
        <QuickFixPreview
          quickFix={selectedFix ?? undefined}
          original={code}
          updated={preview}
          onApply={applyQuickFix}
        />
        {isApplying && <p>Applying fix...</p>}
      </section>
    </div>
  );
}

export default EditorPage;
