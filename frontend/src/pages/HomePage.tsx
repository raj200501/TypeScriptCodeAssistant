import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="page page--home">
      <section className="hero">
        <h2>Production-ready TypeScript analysis in a single workspace.</h2>
        <p>
          TypeScript Code Assistant is a full-stack toolchain for analyzing, formatting, and
          refactoring TypeScript projects. Use the live editor, save snippets, and monitor analysis
          history from one place.
        </p>
        <div className="hero__actions">
          <Link className="button button--primary" to="/editor">
            Launch Editor
          </Link>
          <Link className="button button--secondary" to="/snippets">
            Browse Snippets
          </Link>
        </div>
      </section>
      <section className="grid">
        <div className="card">
          <h3>Analysis Engine</h3>
          <p>Compiler-powered diagnostics, explainers, and quick fixes for common issues.</p>
        </div>
        <div className="card">
          <h3>Live Collaboration</h3>
          <p>Stream results over WebSocket for instant feedback as you type.</p>
        </div>
        <div className="card">
          <h3>Workflow Friendly</h3>
          <p>Save snippets, track analysis runs, and ship changes with confidence.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
