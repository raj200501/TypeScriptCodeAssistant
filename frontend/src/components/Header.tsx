import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import { useTheme } from '../ui/theme';

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/editor', label: 'Editor' },
  { to: '/snippets', label: 'Snippets' },
  { to: '/runs', label: 'History' },
  { to: '/settings', label: 'Settings' },
];

function Header() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Link to="/" className="app-header__logo">
          <span>TypeScript Code Assistant</span>
          <small>Ship-ready analysis workflows for TS teams.</small>
        </Link>
      </div>
      <nav className="app-header__nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? 'is-active' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="app-header__actions">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </Button>
      </div>
    </header>
  );
}

export default Header;
