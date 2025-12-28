import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Card, PageHeader } from '../ui';

function HomePage() {
  return (
    <div className="page page--home">
      <PageHeader
        title="TypeScript Code Assistant"
        subtitle="A premium workspace for analysis, refactors, and run history for TypeScript teams."
        actions={
          <div className="stack-row">
            <Link to="/editor" className="ui-link">
              <Button variant="primary" size="lg">
                Launch Editor
              </Button>
            </Link>
            <Link to="/snippets" className="ui-link">
              <Button variant="secondary" size="lg">
                Browse Snippets
              </Button>
            </Link>
          </div>
        }
        meta={
          <div className="hero-badges">
            <Badge variant="success">Live WebSocket</Badge>
            <Badge variant="info">Diagnostics Engine</Badge>
            <Badge variant="neutral">Built-in Refactors</Badge>
          </div>
        }
      />
      <section className="hero-grid">
        <Card
          title="Analysis Engine"
          subtitle="Compiler-grade diagnostics and explainers."
        >
          <p>
            Run a full lint and type analysis pass, with severity badges and quick fixes surfaced in a
            human-friendly feed.
          </p>
        </Card>
        <Card title="Instant Signals" subtitle="Stream results as you type.">
          <p>
            WebSocket streaming keeps diagnostics and summary counts fresh, so reviewers never lose
            context.
          </p>
        </Card>
        <Card title="Workflow Ready" subtitle="Snippets, runs, and audit trails.">
          <p>
            Save refactor-ready snippets, track the history of analysis runs, and ship fixes with
            confidence.
          </p>
        </Card>
      </section>
      <section className="callout">
        <div>
          <h3>End-to-end flow in one workspace</h3>
          <p>
            Analyze, format, preview quick fixes, and capture snapshots without leaving the UI. The
            same engine powers the API for easy integrations.
          </p>
        </div>
        <Link to="/runs" className="ui-link">
          <Button variant="outline">View recent runs</Button>
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
