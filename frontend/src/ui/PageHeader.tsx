import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, meta }) => {
  return (
    <header className="ui-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {meta && <div className="ui-page-header__meta">{meta}</div>}
      </div>
      {actions && <div className="ui-page-header__actions">{actions}</div>}
    </header>
  );
};

export default PageHeader;
