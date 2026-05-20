import type { ReactNode } from 'react';
import { COLORS, FONTS } from '../config/theme';
import type { Page } from '../App';

const IconHome = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" />
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3v7a3 3 0 0 0 6 0V3" /><path d="M9 10v11" /><path d="M17 3c-1.5 1-2 3-2 6s.5 5 2 6" /><path d="M17 3v18" />
  </svg>
);
const IconCal = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 3v3M16 3v3" /><path d="m9 14 2 2 4-4" />
  </svg>
);

const items: { key: Page; label: string; icon: ReactNode }[] = [
  { key: 'home', label: 'Home', icon: <IconHome /> },
  { key: 'menu', label: 'Menu', icon: <IconMenu /> },
  { key: 'prenota', label: 'Prenota', icon: <IconCal /> },
];

export default function BottomNav({ current, onNavigate }: { current: Page; onNavigate: (p: Page) => void }) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'rgba(13, 18, 15, 0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0 calc(10px + env(safe-area-inset-bottom))',
        zIndex: 1000,
        fontFamily: FONTS.body,
      }}
    >
      {items.map((it) => {
        const active = current === it.key;
        return (
          <button
            key={it.key}
            onClick={() => onNavigate(it.key)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '4px 18px',
              color: active ? COLORS.gold : COLORS.textMuted,
              transition: 'color .2s ease',
            }}
          >
            {active && (
              <span
                style={{
                  position: 'absolute',
                  top: -10,
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${COLORS.gold}33 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }}
              />
            )}
            {it.icon}
            <span style={{ fontSize: 10.5, letterSpacing: '.02em', fontWeight: active ? 600 : 400 }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
