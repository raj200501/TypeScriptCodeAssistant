import React, { useEffect, useState } from 'react';
import { AnalysisRun, Snippet } from '@tca/shared';
import SnippetList from '../components/SnippetList';
import MonacoEditor from '../components/MonacoEditor';
import { tcaClient } from '../services/tcaClient';

function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');

  const refresh = async () => {
    const response = await tcaClient.listSnippets();
    setSnippets(response);
  };

  useEffect(() => {
    refresh();
    tcaClient.listRuns().then(setRuns);
  }, []);

  const selectSnippet = (snippet: Snippet) => {
    setActiveSnippet(snippet);
    setTitle(snippet.title);
    setCode(snippet.code);
  };

  const saveSnippet = async () => {
    if (activeSnippet) {
      const updated = await tcaClient.updateSnippet(activeSnippet.id, { title, code });
      setActiveSnippet(updated);
    } else {
      const created = await tcaClient.createSnippet({ title, code });
      setActiveSnippet(created);
    }
    await refresh();
  };

  const createNew = () => {
    setActiveSnippet(null);
    setTitle('');
    setCode('');
  };

  const deleteSnippet = async (snippet: Snippet) => {
    await tcaClient.deleteSnippet(snippet.id);
    if (activeSnippet?.id === snippet.id) {
      createNew();
    }
    await refresh();
  };

  return (
    <div className="page page--snippets">
      <div className="snippets-layout">
        <section>
          <div className="section-header">
            <h2>Snippets Library</h2>
            <button className="button button--secondary" onClick={createNew}>
              New Snippet
            </button>
          </div>
          <SnippetList snippets={snippets} onSelect={selectSnippet} onDelete={deleteSnippet} />
          <div className="panel">
            <h3>Recent Analysis Runs</h3>
            {runs.length === 0 ? (
              <p className="panel-empty">No analysis runs yet.</p>
            ) : (
              <ul>
                {runs.slice(0, 5).map((run) => (
                  <li key={run.id}>
                    {run.fileName ?? 'Untitled'} — {run.summary.warningCount} warnings
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <section className="snippet-editor">
          <div className="section-header">
            <h2>{activeSnippet ? 'Edit Snippet' : 'Create Snippet'}</h2>
            <button className="button button--primary" onClick={saveSnippet}>
              Save
            </button>
          </div>
          <label className="input-label">
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <div className="editor-pane">
            <MonacoEditor value={code} onChange={setCode} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default SnippetsPage;
