import { useState } from 'react';
import { useApplyTheme } from '@/hooks/use-apply-theme';
import { SettingsOverlay } from '@/features/study/settings-overlay';
import { StudyScreen } from '@/features/study/study-screen';
import { useZolaStore } from '@/store/zola-store';

export function App() {
  useApplyTheme();
  const theme = useZolaStore((state) => state.settings.theme);
  const setTheme = useZolaStore((state) => state.setTheme);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="tw-app">
      <button
        className="tw-settingsbtn tw-tap"
        type="button"
        onClick={() => setSettingsOpen(true)}
        aria-label="Settings"
      >
        ⚙
      </button>
      <button
        className="tw-themebtn tw-tap"
        type="button"
        onClick={() => setTheme(theme === 'day' ? 'night' : 'day')}
        aria-label="Day or night"
      >
        {theme === 'day' ? '☾' : '☀'}
      </button>

      <StudyScreen />

      {settingsOpen && <SettingsOverlay onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
