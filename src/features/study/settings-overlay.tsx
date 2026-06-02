import type { CSSProperties, ReactNode } from 'react';
import { Overlay } from '@/components/overlay';
import { useZolaStore } from '@/store/zola-store';
import { ACCENTS, DURATIONS, type Duration } from '@/types/domain';

/** Settings: default length, cheer sound, time of day, accent. */
export function SettingsOverlay({ onClose }: { onClose: () => void }) {
  const settings = useZolaStore((state) => state.settings);
  const setDuration = useZolaStore((state) => state.setDuration);
  const setTheme = useZolaStore((state) => state.setTheme);
  const setAccent = useZolaStore((state) => state.setAccent);
  const setSound = useZolaStore((state) => state.setSound);

  return (
    <Overlay ariaLabel="Settings" onClose={onClose}>
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: 'var(--surface)',
          border: '1.5px solid var(--line)',
          borderRadius: 22,
          padding: '24px 24px 26px',
          boxShadow: '0 18px 50px rgba(120,80,30,0.22)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <span style={titleStyle}>Settings</span>
          <button
            onClick={onClose}
            className="tw-ctrl tw-ctrl-quiet tw-tap"
            type="button"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <Field label="Default length">
          <Pills
            options={DURATIONS.map((d) => ({ value: String(d), label: `${d} min` }))}
            selected={String(settings.duration)}
            onSelect={(value) => setDuration(Number(value) as Duration)}
          />
        </Field>

        <Field label="Cheer sound">
          <Toggle
            on={settings.sound}
            label="Play a chime when we finish"
            onChange={() => setSound(!settings.sound)}
          />
        </Field>

        <Field label="Time of day">
          <Pills
            options={[
              { value: 'day', label: 'Day' },
              { value: 'night', label: 'Night' },
            ]}
            selected={settings.theme}
            onSelect={(value) => setTheme(value === 'night' ? 'night' : 'day')}
          />
        </Field>

        <Field label="Accent">
          <div role="group" aria-label="Accent" style={{ display: 'flex', gap: 12 }}>
            {ACCENTS.map((color) => {
              const isSelected = settings.accent === color;
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccent(color)}
                  aria-pressed={isSelected}
                  aria-label={color}
                  className="tw-tap"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: color,
                    border: `2.5px solid ${isSelected ? 'var(--ink)' : 'transparent'}`,
                    boxShadow: '0 0 0 1px var(--line)',
                  }}
                />
              );
            })}
          </div>
        </Field>
      </div>
    </Overlay>
  );
}

const titleStyle: CSSProperties = {
  fontFamily: 'var(--display)',
  fontWeight: 700,
  fontSize: 18,
  color: 'var(--ink)',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontFamily: 'var(--ui)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--dim)',
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Pills({
  options,
  selected,
  onSelect,
}: {
  options: Array<{ value: string; label: string }>;
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div role="group" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            aria-pressed={isSelected}
            className="tw-tap"
            style={{
              padding: '9px 16px',
              borderRadius: 999,
              cursor: 'pointer',
              fontFamily: 'var(--display)',
              fontSize: 15,
              fontWeight: 600,
              background: isSelected ? 'var(--accent-soft)' : 'var(--surface)',
              color: isSelected ? 'var(--accent)' : 'var(--dim)',
              border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--line)'}`,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={on}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--ink)',
        fontFamily: 'var(--ui)',
        fontSize: 15,
      }}
    >
      <span>{label}</span>
      <span
        aria-hidden="true"
        style={{
          width: 44,
          height: 26,
          borderRadius: 999,
          flexShrink: 0,
          background: on ? 'var(--accent)' : 'var(--surface-2)',
          border: '1px solid var(--line)',
          position: 'relative',
          transition: 'background .25s ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            insetInlineStart: on ? 20 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: on ? 'var(--on-accent)' : 'var(--faint)',
            transition: 'inset-inline-start .25s ease',
          }}
        />
      </span>
    </button>
  );
}
