import { COLORS, FONTS, RADIUS, VENUE } from '../config/theme';
import { IMAGES } from '../config/images';
import { menuItems } from '../data/menuItems';
import Thumb from './Thumb';
import type { Page } from '../App';

const chips = ['🍸 Cocktail', '🫒 Taglieri', '🌙 Aperto la sera'];

export default function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const popular = menuItems.filter((m) => m.isPopular);

  return (
    <div style={{ fontFamily: FONTS.body, color: COLORS.textPrimary }}>
      {/* HERO */}
      <header
        style={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '22px 22px 36px',
          // overlay scuro -> foto (se presente) -> gradiente base di fallback
          backgroundImage: `linear-gradient(180deg, rgba(11,14,12,0.35) 0%, rgba(11,14,12,0.55) 45%, rgba(11,14,12,0.96) 100%), url("${IMAGES.hero}"), radial-gradient(120% 80% at 50% -10%, #18241b 0%, ${COLORS.background} 60%)`,
          backgroundSize: 'cover, cover, cover',
          backgroundPosition: 'center, center, center',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: COLORS.goldSoft, letterSpacing: '.04em' }}>
            {VENUE.name}
          </span>
          <button
            onClick={() => onNavigate('menu')}
            style={{ fontSize: 14, color: COLORS.textSecondary, background: 'none', border: `1px solid ${COLORS.border}`, padding: '7px 16px', borderRadius: RADIUS.pill, cursor: 'pointer' }}
          >
            Menu
          </button>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span style={{ fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase', color: COLORS.gold }}>
            Bar · {VENUE.city}
          </span>
          <h1
            style={{
              fontFamily: FONTS.display,
              fontWeight: 700,
              fontSize: 'clamp(4rem, 22vw, 6rem)',
              lineHeight: 0.92,
              margin: 0,
              background: `linear-gradient(180deg, #fff 0%, ${COLORS.goldSoft} 60%, ${COLORS.gold} 100%)`,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {VENUE.name}
          </h1>
          <p style={{ fontSize: 17, color: COLORS.textPrimary, opacity: 0.92, maxWidth: '30ch', margin: 0 }}>
            {VENUE.tagline}<br />
            <span style={{ color: COLORS.textSecondary }}>{VENUE.subtitle}</span>
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '2px 0' }}>
            {chips.map((c) => (
              <span key={c} style={{ fontSize: 13, padding: '7px 13px', borderRadius: RADIUS.pill, background: 'rgba(255,255,255,0.06)', border: `1px solid ${COLORS.border}`, backdropFilter: 'blur(4px)' }}>
                {c}
              </span>
            ))}
          </div>

          <button
            onClick={() => onNavigate('prenota')}
            style={{
              alignSelf: 'flex-start',
              marginTop: 4,
              background: COLORS.gradient,
              color: '#1a1206',
              border: 'none',
              borderRadius: RADIUS.pill,
              padding: '15px 30px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 12px 30px -10px rgba(201,162,90,0.55)',
            }}
          >
            Prenota un tavolo
          </button>
          <span style={{ fontSize: 12.5, color: COLORS.textSecondary }}>Prenotazione online · conferma immediata</span>
        </div>
      </header>

      {/* SELEZIONE */}
      <section style={{ padding: '44px 22px 10px' }}>
        <span style={{ fontSize: 12, letterSpacing: '.28em', textTransform: 'uppercase', color: COLORS.gold }}>I più amati</span>
        <h2 style={{ fontFamily: FONTS.display, fontSize: 32, fontWeight: 700, margin: '6px 0 18px' }}>La selezione</h2>

        <div className="no-scrollbar" style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, margin: '0 -22px', padding: '0 22px 8px' }}>
          {popular.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('menu')}
              style={{ flex: '0 0 200px', cursor: 'pointer', background: `linear-gradient(180deg, ${COLORS.cardBg}, ${COLORS.cardBgHover})`, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: 12 }}
            >
              <Thumb src={item.image} fallback={item.fallback} emoji={item.emoji} size={176} radius={12} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12, gap: 8 }}>
                <span style={{ fontFamily: FONTS.display, fontSize: 21, fontWeight: 600 }}>{item.name}</span>
                <span style={{ fontWeight: 600, color: COLORS.goldSoft }}>€{item.price}</span>
              </div>
              <p style={{ fontSize: 13, color: COLORS.textSecondary, margin: '2px 0 0' }}>{item.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => onNavigate('menu')}
          style={{ width: '100%', marginTop: 22, background: 'transparent', color: COLORS.goldSoft, border: `1px solid ${COLORS.borderStrong}`, borderRadius: RADIUS.pill, padding: 15, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
        >
          Vedi tutto il menu →
        </button>
      </section>

      {/* INFO */}
      <section style={{ padding: '30px 22px 40px', color: COLORS.textSecondary }}>
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 22, display: 'grid', gap: 8, fontSize: 14.5 }}>
          <div>🕒 Aperto tutti i giorni · {VENUE.hours}</div>
          <div>📍 {VENUE.address}</div>
        </div>
      </section>
    </div>
  );
}
