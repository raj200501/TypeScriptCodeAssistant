import React from 'react';

function HomePage() {
  return (
    <div>
      <h1>Welcome to the TypeScript Code Assistant</h1>
      <p>Enhance your TypeScript development experience with real-time code suggestions and error checking.</p>
      <section className="hero-section">
        <h2>Build confidently with smarter suggestions</h2>
        <p>
          Paste your TypeScript snippet, request analysis, and receive actionable refactoring ideas in seconds.
        </p>
        <div className="hero-actions">
          <a className="primary-cta" href="/editor">Open the Editor</a>
          <a className="secondary-cta" href="https://www.typescriptlang.org/">Learn TypeScript</a>
        </div>
      </section>
      <section className="feature-grid">
        <div className="feature-card">
          <h3>Guided refactors</h3>
          <p>Get targeted feedback on naming, structure, and maintainability.</p>
        </div>
        <div className="feature-card">
          <h3>Fast feedback loop</h3>
          <p>Analyze snippets instantly to keep your flow uninterrupted.</p>
        </div>
        <div className="feature-card">
          <h3>Team-ready insights</h3>
          <p>Share suggestions and rationale with teammates for consistent code reviews.</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
