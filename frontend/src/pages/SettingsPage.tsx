import React from 'react';
import SettingsPanel from '../components/SettingsPanel';
import { useSettings } from '../hooks/useSettings';

function SettingsPage() {
  const [settings, updateSettings] = useSettings();

  const toggleRule = (ruleId: string) => {
    updateSettings({
      rules: {
        ...settings.rules,
        [ruleId]: !settings.rules[ruleId],
      },
    });
  };

  return (
    <div className="page page--settings">
      <h2>Settings</h2>
      <SettingsPanel
        strict={settings.strict}
        websocketEnabled={settings.websocketEnabled}
        onToggleStrict={(value) => updateSettings({ strict: value })}
        onToggleWebsocket={(value) => updateSettings({ websocketEnabled: value })}
        rules={settings.rules}
        onToggleRule={toggleRule}
      />
    </div>
  );
}

export default SettingsPage;
