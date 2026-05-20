import { useMemo, useState } from 'react';
import { COLORS, FONTS, RADIUS, VENUE } from '../config/theme';
import { getSlots, createBooking, type Booking } from '../lib/booking';

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function formatDateIT(value: string) {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${d}/${m}/${y}`;
}

const labelStyle: React.CSSProperties = {
  fontSize: 13, color: COLORS.textSecondary, marginBottom: 8,
  display: 'block', letterSpacing: '.01em',
};
const inputStyle: React.CSSProperties = {
  width: '100%', fontSize: 16, color: COLORS.textPrimary, background: COLORS.cardBg,
  border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.md,
  padding: '13px 14px', outline: 'none', boxSizing: 'border-box',
};

const CheckIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a1206" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 13 4 4L19 7" />
  </svg>
);

// Party size options — last entry shows as "8+" but value is stored as-is
const PARTY_OPTS = ['1', '2', '3', '4', '5', '6', '7', '8+'];

export default function ReservePage() {
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState('');
  const [people, setPeople] = useState('2');
  const [nome, setNome] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const slots = useMemo(() => getSlots(date), [date]);

  const canSubmit = Boolean(date && slot && people && nome.trim() && phone.trim());

  const onChangeDate = (v: string) => {
    setDate(v);
    setSlot('');
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!date) return setError('Scegli una data.');
    if (!slot) return setError('Scegli un orario disponibile.');
    if (!nome.trim()) return setError('Inserisci il nome.');
    if (!phone.trim()) return setError('Inserisci un numero di telefono.');

    setLoading(true);
    try {
      const res = await createBooking({
        date, time: slot, people, name: nome.trim(),
        phone: phone.trim(), email: email.trim() || undefined,
      });
      setBooking(res);
    } catch {
      setError('Qualcosa è andato storto. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBooking(null); setSlot(''); setNome(''); setPhone(''); setEmail(''); setPeople('2'); setError('');
  };

  const wrapStyle: React.CSSProperties = {
    fontFamily: FONTS.body, color: COLORS.textPrimary, padding: '26px 22px 36px', minHeight: '74vh',
    background: 'radial-gradient(120% 50% at 50% 0%, rgba(47,111,78,0.10) 0%, transparent 55%)',
  };

  // ---------- CONFERMA ----------
  if (booking) {
    return (
      <div style={wrapStyle}>
        <div style={{ display: 'grid', placeItems: 'center', gap: 18, textAlign: 'center', padding: '24px 6px' }}>
          {/* Check icon in gold circle */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: COLORS.gradient,
            display: 'grid', placeItems: 'center',
            boxShadow: `0 14px 34px -10px ${COLORS.gold}99`,
          }}>
            <CheckIcon />
          </div>

          <h1 style={{ fontFamily: FONTS.display, fontSize: 34, fontWeight: 700, margin: 0 }}>
            Prenotazione confermata
          </h1>

          <p style={{ color: COLORS.textSecondary, margin: 0, maxWidth: '32ch' }}>
            Ti aspettiamo da{' '}
            <strong style={{ color: COLORS.goldSoft }}>{VENUE.name}</strong>.{' '}
            Riceverai una conferma a breve.
          </p>

          {/* Summary card */}
          <div style={{
            width: '100%', maxWidth: 360, textAlign: 'left',
            background: `linear-gradient(180deg, ${COLORS.cardBg}, ${COLORS.cardBgHover})`,
            border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg,
            padding: 18, display: 'grid', gap: 10, marginTop: 4,
          }}>
            {[
              ['Locale', VENUE.name],
              ['Data', formatDateIT(booking.date)],
              ['Ora', booking.time],
              ['Persone', booking.people],
              ['Nome', booking.name],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 14.5 }}>
                <span style={{ color: COLORS.textSecondary }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: COLORS.border, margin: '2px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: COLORS.textSecondary, fontSize: 14.5 }}>Codice</span>
              <span style={{
                fontFamily: 'monospace', fontSize: 16, fontWeight: 700,
                color: COLORS.goldSoft, letterSpacing: '.06em',
              }}>
                {booking.id}
              </span>
            </div>
          </div>

          <p style={{ color: COLORS.textMuted, fontSize: 13, margin: 0 }}>
            Ti aspettiamo da {VENUE.name} · {VENUE.hours}
          </p>

          <button
            onClick={reset}
            style={{
              marginTop: 4, background: 'transparent', color: COLORS.goldSoft,
              border: `1px solid ${COLORS.borderStrong}`, borderRadius: RADIUS.pill,
              padding: '13px 26px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Nuova prenotazione
          </button>
        </div>
      </div>
    );
  }

  // ---------- FORM ----------
  return (
    <div style={wrapStyle}>
      <span style={{ fontSize: 12, letterSpacing: '.28em', textTransform: 'uppercase', color: COLORS.gold }}>
        Tavoli
      </span>
      <h1 style={{ fontFamily: FONTS.display, fontSize: 38, fontWeight: 700, margin: '6px 0 8px' }}>
        Prenota un tavolo
      </h1>
      <p style={{ color: COLORS.textSecondary, margin: '0 0 24px', maxWidth: '38ch' }}>
        Scegli data e orario: confermi tu, subito.
      </p>

      <form onSubmit={submit} style={{ display: 'grid', gap: 22 }}>
        {/* Data */}
        <div>
          <label style={labelStyle}>Data</label>
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => onChangeDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Orario / slot chips */}
        <div>
          <label style={labelStyle}>Orario disponibile</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 9 }}>
            {slots.map((s) => {
              const selected = slot === s.time;
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => { setSlot(s.time); setError(''); }}
                  style={{
                    padding: '11px 0',
                    fontSize: 14.5,
                    fontWeight: selected ? 700 : 500,
                    borderRadius: RADIUS.md,
                    cursor: s.available ? 'pointer' : 'not-allowed',
                    border: `1px solid ${selected ? 'transparent' : COLORS.border}`,
                    background: selected
                      ? COLORS.gradient
                      : s.available ? COLORS.cardBg : 'transparent',
                    color: selected
                      ? '#1a1206'
                      : s.available ? COLORS.textPrimary : COLORS.textMuted,
                    textDecoration: s.available ? 'none' : 'line-through',
                    opacity: s.available ? 1 : 0.5,
                    transition: 'all .15s ease',
                  }}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: COLORS.textMuted, margin: '8px 0 0' }}>
            Gli orari barrati (<span style={{ textDecoration: 'line-through' }}>esaurito</span>) non sono prenotabili.
          </p>
        </div>

        {/* Persone chips */}
        <div>
          <label style={labelStyle}>Persone</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
            {PARTY_OPTS.map((n) => {
              const selected = people === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPeople(n)}
                  style={{
                    minWidth: 46, padding: '11px 0', flex: '1 0 46px',
                    fontSize: 15, fontWeight: selected ? 700 : 500,
                    borderRadius: RADIUS.md, cursor: 'pointer',
                    border: `1px solid ${selected ? 'transparent' : COLORS.border}`,
                    background: selected ? COLORS.gradient : COLORS.cardBg,
                    color: selected ? '#1a1206' : COLORS.textPrimary,
                    transition: 'all .15s ease',
                  }}
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dettagli contatto */}
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Il tuo nome"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Telefono</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+39 ..."
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>
                Email{' '}
                <span style={{ color: COLORS.textMuted }}>(facolt.)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Validation error */}
        {error && (
          <p style={{ color: '#e8a07a', fontSize: 13.5, textAlign: 'center', margin: 0 }}>
            {error}
          </p>
        )}

        {/* Submit — disabled until all required fields filled */}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          style={{
            width: '100%', background: COLORS.gradient, color: '#1a1206', border: 'none',
            borderRadius: RADIUS.pill, padding: 17, fontSize: 16.5, fontWeight: 700,
            cursor: (!canSubmit || loading) ? 'not-allowed' : 'pointer',
            opacity: (!canSubmit || loading) ? 0.55 : 1,
            boxShadow: canSubmit ? `0 14px 32px -10px ${COLORS.gold}8c` : 'none',
            transition: 'opacity .2s ease',
          }}
        >
          {loading ? 'Confermo…' : 'Conferma prenotazione'}
        </button>

        <p style={{ textAlign: 'center', color: COLORS.textSecondary, fontSize: 13, margin: 0 }}>
          Aperto tutti i giorni · {VENUE.hours}
        </p>
      </form>
    </div>
  );
}
