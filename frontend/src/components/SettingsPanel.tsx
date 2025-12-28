import React from 'react';

interface SettingsPanelProps {
  strict: boolean;
  websocketEnabled: boolean;
  onToggleStrict: (value: boolean) => void;
  onToggleWebsocket: (value: boolean) => void;
  rules: Record<string, boolean>;
  onToggleRule: (ruleId: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  strict,
  websocketEnabled,
  onToggleStrict,
  onToggleWebsocket,
  rules,
  onToggleRule,
}) => {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3>Analysis Defaults</h3>
        <label>
          <input
            type="checkbox"
            checked={strict}
            onChange={(event) => onToggleStrict(event.target.checked)}
          />
          Strict compiler mode
        </label>
        <label>
          <input
            type="checkbox"
            checked={websocketEnabled}
            onChange={(event) => onToggleWebsocket(event.target.checked)}
          />
          Enable live WebSocket analysis
        </label>
      </div>
      <div className="settings-section">
        <h3>Rules</h3>
        {Object.entries(rules).map(([ruleId, enabled]) => (
          <label key={ruleId}>
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => onToggleRule(ruleId)}
            />
            {ruleId}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
