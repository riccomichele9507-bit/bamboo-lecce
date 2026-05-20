import { useState } from 'react';
import { COLORS, FONTS, RADIUS } from '../config/theme';
import { menuItems, categories, type Category } from '../data/menuItems';
import Thumb from './Thumb';
import type { Page } from '../App';

export default function MenuPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [tab, setTab] = useState<Category>('Da mangiare');
  const items = menuItems.filter((m) => m.category === tab);

  return (
    <div style={{ fontFamily: FONTS.body, color: COLORS.textPrimary, padding: '26px 22px 30px' }}>
      <span style={{ fontSize: 12, letterSpacing: '.28em', textTransform: 'uppercase', color: COLORS.gold }}>La nostra selezione</span>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 700, margin: '6px 0 20px' }}>Menu</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {categories.map((c) => {
          const active = tab === c;
          return (
            <button
              key={c}
              onClick={() => setTab(c)}
              style={{
                flex: 1,
                padding: '12px 10px',
                borderRadius: RADIUS.pill,
                border: `1px solid ${active ? 'transparent' : COLORS.border}`,
                background: active ? COLORS.gradient : 'transparent',
                color: active ? '#1a1206' : COLORS.textSecondary,
                fontWeight: active ? 700 : 500,
                fontSize: 14.5,
                cursor: 'pointer',
                transition: 'all .2s ease',
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: `linear-gradient(180deg, ${COLORS.cardBg}, ${COLORS.cardBgHover})`,
              border: `1px solid ${COLORS.border}`,
              borderRadius: RADIUS.lg,
              padding: 12,
            }}
          >
            <Thumb src={item.image} fallback={item.fallback} emoji={item.emoji} size={66} radius={12} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                <span style={{ fontFamily: FONTS.display, fontSize: 21, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.name}
                  {item.isPopular && (
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: COLORS.gold, border: `1px solid ${COLORS.border}`, padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase' }}>
                      Top
                    </span>
                  )}
                </span>
                <span style={{ fontWeight: 600, color: COLORS.goldSoft, whiteSpace: 'nowrap' }}>€{item.price}</span>
              </div>
              <p style={{ fontSize: 13.5, color: COLORS.textSecondary, margin: '3px 0 0' }}>{item.description}</p>
            </div>
          </li>
        ))}
      </ul>

      <p style={{ fontSize: 12.5, color: COLORS.textMuted, textAlign: 'center', marginTop: 18 }}>
        I prezzi sono indicativi (demo) e verranno confermati dal locale.
      </p>

      <button
        onClick={() => onNavigate('prenota')}
        style={{ width: '100%', marginTop: 14, background: COLORS.gradient, color: '#1a1206', border: 'none', borderRadius: RADIUS.pill, padding: 16, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 30px -12px rgba(201,162,90,0.5)' }}
      >
        Prenota un tavolo
      </button>
    </div>
  );
}
