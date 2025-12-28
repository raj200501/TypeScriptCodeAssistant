import React from 'react';

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => {
  return (
    <label className="ui-toggle">
      <span>
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
      <span className="ui-toggle__control">
        <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
        <span className="ui-toggle__slider" />
      </span>
    </label>
  );
};

export default ToggleSwitch;
