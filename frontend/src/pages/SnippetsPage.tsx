import React, { useEffect, useMemo, useState } from 'react';
import { AnalysisRun, Snippet } from '@tca/shared';
import SnippetList from '../components/SnippetList';
import MonacoEditor from '../components/MonacoEditor';
import { tcaClient } from '../services/tcaClient';
import { Badge, Button, Card, Drawer, PageHeader, Skeleton } from '../ui';
import { useToast } from '../ui/Toast';

function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(null);
  const [runs, setRuns] = useState<AnalysisRun[]>([]);
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { pushToast } = useToast();

  const refresh = async () => {
    const response = await tcaClient.listSnippets();
    setSnippets(response);
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await refresh();
      const runData = await tcaClient.listRuns();
      setRuns(runData);
      setIsLoading(false);
    };
    load();
  }, []);

  const selectSnippet = (snippet: Snippet) => {
    setActiveSnippet(snippet);
    setTitle(snippet.title);
    setCode(snippet.code);
  };

  const saveSnippet = async () => {
    setIsSaving(true);
    if (activeSnippet) {
      const updated = await tcaClient.updateSnippet(activeSnippet.id, { title, code });
      setActiveSnippet(updated);
      pushToast({ title: 'Snippet updated', description: updated.title, variant: 'success' });
    } else {
      const created = await tcaClient.createSnippet({ title, code });
      setActiveSnippet(created);
      pushToast({ title: 'Snippet saved', description: created.title, variant: 'success' });
    }
    await refresh();
    setIsSaving(false);
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
    pushToast({ title: 'Snippet removed', description: snippet.title, variant: 'info' });
  };

  const filteredSnippets = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return snippets;
    }
    return snippets.filter(
      (snippet) => snippet.title.toLowerCase().includes(query) || snippet.code.toLowerCase().includes(query)
    );
  }, [search, snippets]);

  return (
    <div className="page page--snippets">
      <PageHeader
        title="Snippets Library"
        subtitle="Curate reusable TypeScript patterns and track recent analysis runs."
        actions={
          <div className="stack-row">
            <Button variant="secondary" onClick={createNew}>
              New Snippet
            </Button>
            <Button variant="primary" onClick={saveSnippet} disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        }
        meta={<Badge variant="neutral">{snippets.length} snippets</Badge>}
      />
      <div className="snippets-layout">
        <section>
          <Card
            title="Library"
            subtitle="Search, browse, and open saved snippets."
            actions={
              <input
                className="ui-input"
                placeholder="Search snippets"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            }
          >
            {isLoading ? (
              <div className="stack-lg">
                <Skeleton height={24} />
                <Skeleton height={24} />
                <Skeleton height={24} />
              </div>
            ) : (
              <SnippetList snippets={filteredSnippets} onSelect={selectSnippet} onDelete={deleteSnippet} />
            )}
          </Card>
          <Card title="Recent Analysis Runs" subtitle="Latest five runs across the workspace.">
            {runs.length === 0 ? (
              <p className="panel-empty">No analysis runs yet.</p>
            ) : (
              <ul className="run-list">
                {runs.slice(0, 5).map((run) => (
                  <li key={run.id}>
                    <span>{run.fileName ?? 'Untitled'} </span>
                    <Badge variant={run.summary.warningCount > 0 ? 'warning' : 'neutral'}>
                      {run.summary.warningCount} warnings
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
        <section className="snippet-editor">
          <Card
            title={activeSnippet ? 'Edit Snippet' : 'Create Snippet'}
            subtitle="Draft and refine reusable blocks of TypeScript."
          >
            <label className="input-label">
              Title
              <input
                className="ui-input"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. useViewport hook"
              />
            </label>
            <div className="editor-pane">
              <MonacoEditor value={code} onChange={setCode} />
            </div>
          </Card>
        </section>
      </div>
      <Drawer
        isOpen={Boolean(activeSnippet)}
        title={activeSnippet?.title || 'Snippet details'}
        subtitle={activeSnippet ? `Updated ${new Date(activeSnippet.updatedAt).toLocaleString()}` : undefined}
        onClose={() => setActiveSnippet(null)}
        actions={
          <div className="stack-row">
            <Button variant="secondary" onClick={saveSnippet} disabled={isSaving}>
              Save changes
            </Button>
            {activeSnippet && (
              <Button variant="ghost" onClick={() => deleteSnippet(activeSnippet)}>
                Delete
              </Button>
            )}
          </div>
        }
      >
        <div className="drawer-content">
          <p>Snippet size: {activeSnippet ? activeSnippet.code.split('\n').length : 0} lines</p>
          <p>Keep snippets short and focused for better reuse.</p>
          <Button variant="outline" onClick={() => navigator.clipboard?.writeText(code)}>
            Copy to clipboard
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default SnippetsPage;
