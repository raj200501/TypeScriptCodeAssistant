import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h1>TypeScript Code Assistant</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/editor">Editor</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
