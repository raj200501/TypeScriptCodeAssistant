import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <h1>TypeScript Code Assistant</h1>
        <p>Ship-ready analysis workflows for TypeScript teams.</p>
      </div>
      <nav className="app-header__nav">
        <Link to="/">Overview</Link>
        <Link to="/editor">Editor</Link>
        <Link to="/snippets">Snippets</Link>
        <Link to="/runs">History</Link>
        <Link to="/settings">Settings</Link>
      </nav>
    </header>
  );
}

export default Header;
