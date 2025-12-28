import React from 'react';

type CardProps = {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, subtitle, actions, children, className }) => {
  return (
    <section className={['ui-card', className].filter(Boolean).join(' ')}>
      {(title || actions) && (
        <header className="ui-card__header">
          <div>
            {title && <h3 className="ui-card__title">{title}</h3>}
            {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="ui-card__actions">{actions}</div>}
        </header>
      )}
      <div className="ui-card__body">{children}</div>
    </section>
  );
};

export default Card;
