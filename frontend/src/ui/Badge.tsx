import React from 'react';

type BadgeVariant = 'info' | 'warning' | 'error' | 'success' | 'neutral';

type BadgeProps = {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
};

const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, className }) => {
  return (
    <span className={['ui-badge', `ui-badge--${variant}`, className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
};

export default Badge;
