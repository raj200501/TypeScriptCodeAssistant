import React from 'react';
import Badge from '../ui/Badge';

function Footer() {
  return (
    <footer className="app-footer">
      <div>
        <strong>TypeScript Code Assistant</strong>
        <p>API-ready analysis workflows for modern TypeScript teams.</p>
      </div>
      <div className="app-footer__links">
        <span>
          <Badge variant="info">REST</Badge> /api
        </span>
        <span>
          <Badge variant="success">WS</Badge> /api/stream
        </span>
        <span>© 2024 TCA</span>
      </div>
    </footer>
  );
}

export default Footer;
