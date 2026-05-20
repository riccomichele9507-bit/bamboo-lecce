// booking.ts — Layer 3 mock per prenotazioni Bamboo Lecce
// Pronto per essere collegato a Google Calendar in produzione.

export interface Slot {
  time: string;      // es. "19:00"
  available: boolean;
}

export interface Booking {
  id: string;        // codice prenotazione es. "BAM-4F2A"
  date: string;      // ISO date es. "2026-05-20"
  time: string;      // es. "20:30"
  people: string;    // es. "2" oppure "8+"
  name: string;
  phone: string;
  email?: string;
  createdAt: string; // ISO datetime
}

/** @deprecated Usare Booking direttamente — id e createdAt sono già nel tipo Booking */
export type BookingResult = Pick<Booking, 'id' | 'createdAt'>;

/**
 * Genera gli slot per la prenotazione tavoli per una data.
 * Orari: 18:00–22:30, step 30 min (ultimo slot 22:30 — il locale chiude alle 23:00).
 * La disponibilità è deterministica: hash della data + indice slot
 * così ogni giorno ha sempre lo stesso pattern di slot liberi/occupati.
 * ~25-35% degli slot risultano non disponibili per rendere il demo realistico.
 * DOMENICA = CHIUSO: se la data è domenica, ritorna lista vuota.
 */
export function getSlots(dateISO: string): Slot[] {
  // Domenica chiuso — ritorna lista vuota
  if (dateISO) {
    const [y, m, d] = dateISO.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (date.getDay() === 0) return [];
  }

  // Slot 18:00 → 22:30, ogni 30 minuti
  const times: string[] = [];
  for (let h = 18; h <= 22; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    times.push(`${String(h).padStart(2, '0')}:30`);
  }
  // Rimuove "23:00" — il locale chiude alle 23:00, l'ultimo slot è 22:30
  // (il loop termina a 22:30, quindi non serve rimuovere nulla)

  // Hash semplice della stringa data per seed deterministico
  let seed = 0;
  for (let i = 0; i < dateISO.length; i++) {
    seed = (seed * 31 + dateISO.charCodeAt(i)) >>> 0;
  }

  return times.map((time, i) => {
    // ~25-35% degli slot sono occupati, determinato dal seed + indice
    const h = ((seed ^ (i * 2654435761)) >>> 0) % 100;
    return { time, available: h > 30 };
  });
}

// === INTEGRAZIONE FUTURA: Google Calendar ===
// In produzione, sostituire il mock sotto con una POST a un endpoint backend
// che crea l'evento sul Google Calendar del cliente, es:
//
//   const res = await fetch('/api/bookings', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(b),
//   });
//   if (!res.ok) throw new Error(await res.text());
//   return res.json() as Promise<BookingResult>;
//
// Il backend usa l'API Google Calendar (events.insert) con OAuth del locale:
//   1. Verifica disponibilità reale (events.list con timeMin/timeMax)
//   2. Crea l'evento con events.insert sull'agenda di Bamboo
//   3. Invia email/SMS di conferma al cliente
//   4. Restituisce { id (Google eventId), createdAt }
//
// Schema endpoint atteso:
//   POST /api/bookings
//   Body: { date, time, people, name, phone, email? }
//   Response: { id, createdAt }
// =====================================================================

/** Genera un codice prenotazione leggibile es. BAM-AB12 */
function generateBookingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `BAM-${code}`;
}

const STORAGE_KEY = 'bamboo_bookings';

/**
 * Crea una prenotazione (DEMO: salva in localStorage).
 * In produzione: sostituire con la chiamata al backend descritta sopra.
 */
export async function createBooking(
  input: Omit<Booking, 'id' | 'createdAt'>,
): Promise<Booking> {
  // Simula latenza rete (UX realistica del demo)
  await new Promise((r) => setTimeout(r, 900));

  const booking: Booking = {
    ...input,
    id: generateBookingCode(),
    createdAt: new Date().toISOString(),
  };

  // Persiste in localStorage per mostrare le prenotazioni nel demo
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: Booking[] = raw ? JSON.parse(raw) : [];
    existing.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage non disponibile (SSR / private browsing) — non bloccare
  }

  return booking;
}
