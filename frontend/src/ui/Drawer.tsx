import React, { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, title, subtitle, onClose, children, actions }) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <div className={['ui-drawer', isOpen ? 'ui-drawer--open' : ''].filter(Boolean).join(' ')}>
      <div className="ui-drawer__overlay" onClick={onClose} role="presentation" />
      <aside className="ui-drawer__panel" aria-hidden={!isOpen}>
        <header className="ui-drawer__header">
          <div>
            <h3>{title}</h3>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="ui-icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="ui-drawer__body">{children}</div>
        {actions && <footer className="ui-drawer__footer">{actions}</footer>}
      </aside>
    </div>
  );
};

export default Drawer;
