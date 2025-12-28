import { useEffect, useState } from 'react';

const defaultRules: Record<string, boolean> = {
  'no-var': true,
  'prefer-const': true,
  'no-console': true,
  'no-non-null-assertion': true,
};

interface SettingsState {
  strict: boolean;
  websocketEnabled: boolean;
  rules: Record<string, boolean>;
}

const STORAGE_KEY = 'tca.settings';

export const useSettings = (): [SettingsState, (update: Partial<SettingsState>) => void] => {
  const [state, setState] = useState<SettingsState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { strict: true, websocketEnabled: true, rules: defaultRules };
    }
    try {
      return { strict: true, websocketEnabled: true, rules: defaultRules, ...JSON.parse(stored) };
    } catch (error) {
      return { strict: true, websocketEnabled: true, rules: defaultRules };
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = (updateState: Partial<SettingsState>) => {
    setState((prev) => ({ ...prev, ...updateState }));
  };

  return [state, update];
};
