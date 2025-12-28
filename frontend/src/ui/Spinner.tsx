import React from 'react';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label }) => {
  return (
    <div className={`ui-spinner ui-spinner--${size}`} role="status" aria-live="polite">
      <span className="ui-spinner__circle" />
      {label && <span className="ui-spinner__label">{label}</span>}
    </div>
  );
};

export default Spinner;
