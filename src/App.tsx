import { useEffect, useState } from 'react';
import { COLORS, FONTS } from './config/theme';
import HomePage from './components/HomePage';
import MenuPage from './components/MenuPage';
import ReservePage from './components/ReservePage';
import BottomNav from './components/BottomNav';

export type Page = 'home' | 'menu' | 'prenota';

export default function App() {
  const [page, setPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [page]);

  return (
    <div
      style={{
        background: COLORS.background,
        minHeight: '100vh',
        maxWidth: 480,
        margin: '0 auto',
        position: 'relative',
        paddingBottom: 86,
        color: COLORS.textPrimary,
        fontFamily: FONTS.body,
        boxShadow: '0 0 60px rgba(0,0,0,0.5)',
        overflowX: 'hidden',
      }}
    >
      {page === 'home' && <HomePage onNavigate={setPage} />}
      {page === 'menu' && <MenuPage onNavigate={setPage} />}
      {page === 'prenota' && <ReservePage />}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '34px 22px 30px', borderTop: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}>
        <div style={{ fontFamily: FONTS.display, fontSize: 26, fontWeight: 700, color: COLORS.goldSoft }}>Bamboo</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Bar · Lecce</div>
        <div style={{ fontSize: 12, marginTop: 12, color: COLORS.textMuted }}>
          Demo realizzata da <strong style={{ color: COLORS.goldSoft }}>Semplifica AI</strong>
        </div>
      </footer>

      <BottomNav current={page} onNavigate={setPage} />
    </div>
  );
}
