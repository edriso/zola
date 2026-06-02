import { useEffect } from 'react';
import { useZolaStore } from '@/store/zola-store';

/** Reflects the theme and accent onto <html> so the warm palette swaps. */
export function useApplyTheme(): void {
  const theme = useZolaStore((state) => state.settings.theme);
  const accent = useZolaStore((state) => state.settings.accent);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.setProperty('--accent', accent);
  }, [theme, accent]);
}
