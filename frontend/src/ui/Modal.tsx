import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, description, onClose, children, actions }) => {
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

  if (!isOpen) {
    return null;
  }

  return (
    <div className="ui-modal__overlay" role="dialog" aria-modal="true">
      <div className="ui-modal">
        <header className="ui-modal__header">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="ui-icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>
        <div className="ui-modal__body">{children}</div>
        {actions && <footer className="ui-modal__footer">{actions}</footer>}
      </div>
    </div>
  );
};

export default Modal;
