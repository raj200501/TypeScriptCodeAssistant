import React from 'react';
import ToggleSwitch from '../ui/ToggleSwitch';
import Badge from '../ui/Badge';

interface SettingsPanelProps {
  strict: boolean;
  websocketEnabled: boolean;
  onToggleStrict: (value: boolean) => void;
  onToggleWebsocket: (value: boolean) => void;
  rules: Record<string, boolean>;
  onToggleRule: (ruleId: string) => void;
  showRules?: boolean;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  strict,
  websocketEnabled,
  onToggleStrict,
  onToggleWebsocket,
  rules,
  onToggleRule,
  showRules = true,
}) => {
  return (
    <div className="settings-panel">
      <div className="settings-section">
        <h3>Analysis Defaults</h3>
        <ToggleSwitch
          checked={strict}
          onChange={onToggleStrict}
          label="Strict compiler mode"
          description="Fail fast on unsafe typing patterns."
        />
        <ToggleSwitch
          checked={websocketEnabled}
          onChange={onToggleWebsocket}
          label="Live WebSocket analysis"
          description="Stream diagnostics while you type."
        />
      </div>
      {showRules && (
        <div className="settings-section">
          <div className="settings-section__header">
            <h3>Rules</h3>
            <Badge variant="neutral">{Object.keys(rules).length} active</Badge>
          </div>
          <div className="settings-rules">
            {Object.entries(rules).map(([ruleId, enabled]) => (
              <ToggleSwitch
                key={ruleId}
                checked={enabled}
                onChange={() => onToggleRule(ruleId)}
                label={ruleId}
                description={enabled ? 'Enabled' : 'Disabled'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
