import React, { useState } from 'react';
import SettingsPanel from '../components/SettingsPanel';
import { useSettings } from '../hooks/useSettings';
import { Badge, Card, PageHeader, Tabs, ToggleSwitch } from '../ui';
import { useTheme } from '../ui/theme';

const tabs = [
  { id: 'general', label: 'General', description: 'Theme & runtime toggles' },
  { id: 'rules', label: 'Rules', description: 'Linting & analysis checks' },
];

function SettingsPage() {
  const [settings, updateSettings] = useSettings();
  const [activeTab, setActiveTab] = useState('general');
  const { theme, toggleTheme } = useTheme();

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
      <PageHeader
        title="Settings"
        subtitle="Customize analysis defaults, theme, and active rules."
        meta={<Badge variant="neutral">{Object.keys(settings.rules).length} rules</Badge>}
      />
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'general' ? (
        <div className="settings-grid">
          <Card title="Theme" subtitle="Switch between light and dark modes.">
            <ToggleSwitch
              checked={theme === 'dark'}
              onChange={toggleTheme}
              label="Dark mode"
              description="Persisted per browser."
            />
          </Card>
          <Card title="Workspace Defaults" subtitle="Global analysis settings across the app.">
            <SettingsPanel
              strict={settings.strict}
              websocketEnabled={settings.websocketEnabled}
              onToggleStrict={(value) => updateSettings({ strict: value })}
              onToggleWebsocket={(value) => updateSettings({ websocketEnabled: value })}
              rules={settings.rules}
              onToggleRule={toggleRule}
              showRules={false}
            />
          </Card>
        </div>
      ) : (
        <Card title="Rules" subtitle="Toggle individual rules in the analysis engine.">
          <SettingsPanel
            strict={settings.strict}
            websocketEnabled={settings.websocketEnabled}
            onToggleStrict={(value) => updateSettings({ strict: value })}
            onToggleWebsocket={(value) => updateSettings({ websocketEnabled: value })}
            rules={settings.rules}
            onToggleRule={toggleRule}
          />
        </Card>
      )}
    </div>
  );
}

export default SettingsPage;
