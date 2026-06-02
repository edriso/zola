import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from '@/App';
import { createDefaultState } from '@/lib/repository';
import { useZolaStore } from '@/store/zola-store';

function reset() {
  localStorage.clear();
  const defaults = createDefaultState();
  useZolaStore.setState({ settings: defaults.settings, stats: defaults.stats });
}

beforeEach(() => {
  reset();
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

function advance(seconds: number) {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000);
  });
}

function studyTogether() {
  fireEvent.click(screen.getByRole('button', { name: 'Study together' }));
}

describe('the study-together loop', () => {
  it('starts a session and counts down', () => {
    render(<App />);
    expect(screen.getByText('Zola')).toBeInTheDocument();
    studyTogether();

    expect(screen.getByText('25:00')).toBeInTheDocument();
    advance(3);
    expect(screen.getByText('24:57')).toBeInTheDocument();
  });

  it('pauses and resumes', () => {
    render(<App />);
    studyTogether();
    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: 'Resume' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Resume' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('ends early kindly, banks the minutes, and offers to study again', () => {
    render(<App />);
    studyTogether();
    advance(120); // > 30s, so it banks
    fireEvent.click(screen.getByRole('button', { name: /done for now/ }));

    expect(screen.getByRole('button', { name: 'Study again' })).toBeInTheDocument();
    expect(useZolaStore.getState().stats.sessions).toBe(1);
    expect(useZolaStore.getState().stats.streak).toBe(1);
  });

  it('celebrates a natural finish and banks the full session', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '15 min' }));
    studyTogether();
    advance(15 * 60);

    expect(screen.getByText(/We did it/)).toBeInTheDocument();
    const stats = useZolaStore.getState().stats;
    expect(stats.sessions).toBe(1);
    expect(stats.totalMin).toBe(15);
  });
});

describe('settings', () => {
  it('toggles day / night on the document element', () => {
    render(<App />);
    expect(document.documentElement.getAttribute('data-theme')).toBe('day');
    fireEvent.click(screen.getByRole('button', { name: 'Day or night' }));
    expect(document.documentElement.getAttribute('data-theme')).toBe('night');
  });

  it('changes the default length from the settings panel', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: '45 min' }));
    expect(useZolaStore.getState().settings.duration).toBe(45);
  });
});
