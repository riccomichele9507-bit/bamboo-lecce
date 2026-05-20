# Bamboo — Bar a Lecce (web app demo)

App **mobile-first** per Bamboo, bar a Lecce. Costruita con il plugin **vibecoding-designer**.
Stack: **React + Vite + TypeScript** (inline styles), tema *notturno elegante*.
Demo realizzata da **Semplifica AI**.

Schermate: **Home/Hero** · **Menu** (cibo + drink) · **Prenotazione** (form → WhatsApp), con bottom nav.

## Struttura
```
index.html              entry Vite
src/
  main.tsx              bootstrap React
  App.tsx               stato pagine + footer + BottomNav
  index.css             reset globale
  config/
    theme.ts            COLORS, FONTS, VENUE (numero WhatsApp, orari, indirizzo)
    images.ts           percorsi immagini (/img/*)
  data/
    menuItems.ts        voci menu (cibo + drink) con prezzi
  components/
    HomePage.tsx  MenuPage.tsx  ReservePage.tsx  BottomNav.tsx  Thumb.tsx
public/
  logo.svg
  img/                  hero + foto menu (generate con nano-banana)
mockups/                mockup notturno + bamboo + gallery.html
```

## Sviluppo
```
npm install
npm run dev        # http://localhost:5173
npm run build      # output in dist/
npm run preview
```

## Da personalizzare prima del lancio reale
1. **Numero WhatsApp** → `src/config/theme.ts` → `VENUE.whatsappNumber` (formato `39XXXXXXXXXX`).
2. **Prezzi** → `src/data/menuItems.ts` (ora valori demo indicativi).
3. **Indirizzo / orari / Instagram** → `src/config/theme.ts` → `VENUE`.
4. **Foto** → `public/img/` (rigenerabili con nano-banana / kie.ai).

## Deploy (GitHub → Vercel)
```
git init && git add -A && git commit -m "init"
gh repo create bamboo-lecce --public --source . --push
vercel --prod          # Vercel rileva Vite, build automatica (dist/)
```
