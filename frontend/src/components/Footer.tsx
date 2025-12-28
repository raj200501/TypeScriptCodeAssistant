import React from 'react';

function Footer() {
  return (
    <footer className="app-footer">
      <p>&copy; 2024 TypeScript Code Assistant</p>
      <div className="app-footer__links">
        <span>API: /api/openapi.json</span>
        <span>WebSocket: /api/stream</span>
      </div>
    </footer>
  );
}

export default Footer;
