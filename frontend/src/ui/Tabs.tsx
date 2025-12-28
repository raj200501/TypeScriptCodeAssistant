import React from 'react';

type Tab = {
  id: string;
  label: string;
  description?: string;
};

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="ui-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={['ui-tab', activeTab === tab.id ? 'ui-tab--active' : '']
            .filter(Boolean)
            .join(' ')}
        >
          <span>{tab.label}</span>
          {tab.description && <small>{tab.description}</small>}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
