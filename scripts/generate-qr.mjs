/**
 * Genera poster QR code branded per l'app prenotazioni Bamboo Lecce.
 * Output: public/qr/ — 2 varianti (dark "notturno" + "bamboo" natural), SVG + PNG.
 *
 * Run: node scripts/generate-qr.mjs
 * (o npm run generate-qr dopo aver aggiunto lo script in package.json)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import QRCode from 'qrcode';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ============================================================
// COSTANTE — aggiorna dopo il deploy su Vercel
// ============================================================
const APP_URL = 'https://bamboo-lecce.vercel.app/';
// ============================================================

const OUT_DIR = path.join(ROOT, 'public', 'qr');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ============================================================
// Palette variante DARK ("notturno")
// ============================================================
const DARK = {
  bg: '#0b0e0c',
  bg2: '#151b17',
  gold: '#c9a25a',
  goldSoft: '#e2c585',
  text: '#f3eee2',
  textMuted: '#a7a297',
  qrFg: '#e2c585',      // moduli QR in gold soft
  qrBg: '#0f1411',      // sfondo riquadro QR
  accent: '#2f6f4e',    // verde
};

// ============================================================
// Palette variante BAMBOO ("natural")
// ============================================================
const BAMBOO = {
  bg: '#f3efe3',
  bg2: '#ece7d8',
  green: '#3f7d3a',
  greenDeep: '#2a5626',
  wood: '#8b6340',
  woodLight: '#c8a068',
  text: '#1a1a10',
  textMuted: '#5a5040',
  qrFg: '#2a5626',      // moduli QR verde scuro
  qrBg: '#fffdf6',      // sfondo riquadro QR crema
  accent: '#8b6340',
};

// ============================================================
// Layout (condiviso)
// ============================================================
const W = 800;
const H = 1100;
const QR_BOX = 500;
const QR_X = (W - QR_BOX) / 2;
const QR_Y = 330;
const PRINT_WIDTH = 2400;

/**
 * Genera il contenuto interno dell'SVG QR code, scalato a QR_BOX x QR_BOX.
 */
async function buildQrInner(fgColor, bgColor) {
  const qrSvg = await QRCode.toString(APP_URL, {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 0,
    color: {
      dark: fgColor,
      light: '#00000000', // trasparente
    },
  });

  const innerMatch = qrSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const qrInner = innerMatch ? innerMatch[1] : qrSvg;
  const viewBoxMatch = qrSvg.match(/viewBox="0 0 (\d+) (\d+)"/);
  const qrSize = viewBoxMatch ? parseInt(viewBoxMatch[1], 10) : 33;
  const qrScale = QR_BOX / qrSize;

  return { qrInner, qrScale };
}

// ============================================================
// Poster DARK — variante notturno
// ============================================================
async function buildDarkSVG() {
  const { qrInner, qrScale } = await buildQrInner(DARK.qrFg, DARK.qrBg);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <!-- Sfondo gradient scuro -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f1411"/>
      <stop offset="100%" stop-color="#0b0e0c"/>
    </linearGradient>
    <!-- Aloni ambientali -->
    <radialGradient id="glow1" cx="50%" cy="15%" r="50%">
      <stop offset="0%" stop-color="${DARK.accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${DARK.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="85%" r="45%">
      <stop offset="0%" stop-color="${DARK.gold}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${DARK.gold}" stop-opacity="0"/>
    </radialGradient>
    <!-- Gradient oro per testo titolo -->
    <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${DARK.goldSoft}"/>
      <stop offset="60%" stop-color="${DARK.gold}"/>
      <stop offset="100%" stop-color="#b87333"/>
    </linearGradient>
  </defs>

  <!-- Sfondo -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect width="${W}" height="${H}" fill="url(#glow1)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>

  <!-- Cornice decorativa doppia -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none"
        stroke="${DARK.gold}" stroke-opacity="0.18" stroke-width="1"/>
  <rect x="36" y="36" width="${W - 72}" height="${H - 72}" fill="none"
        stroke="${DARK.gold}" stroke-opacity="0.30" stroke-width="0.7"/>

  <!-- Angoli decorativi in oro -->
  <!-- TL -->
  <line x1="24" y1="80" x2="24" y2="24" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <line x1="24" y1="24" x2="80" y2="24" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <!-- TR -->
  <line x1="${W - 24}" y1="80" x2="${W - 24}" y2="24" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <line x1="${W - 80}" y1="24" x2="${W - 24}" y2="24" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <!-- BL -->
  <line x1="24" y1="${H - 80}" x2="24" y2="${H - 24}" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <line x1="24" y1="${H - 24}" x2="80" y2="${H - 24}" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <!-- BR -->
  <line x1="${W - 24}" y1="${H - 80}" x2="${W - 24}" y2="${H - 24}" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>
  <line x1="${W - 80}" y1="${H - 24}" x2="${W - 24}" y2="${H - 24}" stroke="${DARK.gold}" stroke-opacity="0.7" stroke-width="2"/>

  <!-- Eyebrow + separatore -->
  <g transform="translate(${W / 2}, 110)" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif">
    <line x1="-90" y1="0" x2="-22" y2="0" stroke="${DARK.gold}" stroke-opacity="0.45" stroke-width="1"/>
    <circle cx="0" cy="-1" r="3.5" fill="${DARK.gold}"/>
    <line x1="22" y1="0" x2="90" y2="0" stroke="${DARK.gold}" stroke-opacity="0.45" stroke-width="1"/>
    <text y="26" font-size="13" letter-spacing="5.5" fill="${DARK.gold}" font-weight="500">
      COCKTAIL BAR · LECCE
    </text>
  </g>

  <!-- Titolo BAMBOO -->
  <text x="${W / 2}" y="230"
        text-anchor="middle"
        font-family="'Georgia', 'Times New Roman', serif"
        font-size="108" font-weight="700" letter-spacing="6"
        fill="url(#goldGrad)">
    BAMBOO
  </text>

  <!-- Linea sottotitolo -->
  <line x1="${W / 2 - 140}" y1="258" x2="${W / 2 + 140}" y2="258"
        stroke="${DARK.gold}" stroke-opacity="0.25" stroke-width="1"/>

  <!-- Testo intro -->
  <text x="${W / 2}" y="298"
        text-anchor="middle"
        font-family="'Georgia', serif"
        font-size="18" font-style="italic" font-weight="300"
        fill="${DARK.textMuted}" letter-spacing="1">
    Prenota il tuo tavolo
  </text>

  <!-- Riquadro QR con alone oro -->
  <rect x="${QR_X - 28}" y="${QR_Y - 28}" width="${QR_BOX + 56}" height="${QR_BOX + 56}"
        fill="${DARK.qrBg}" rx="20"
        stroke="${DARK.gold}" stroke-opacity="0.22" stroke-width="1.5"/>

  <!-- QR code centrato -->
  <g transform="translate(${QR_X} ${QR_Y}) scale(${qrScale})">
    ${qrInner}
  </g>

  <!-- Pallini decorativi agli angoli del riquadro QR -->
  <circle cx="${QR_X - 14}" cy="${QR_Y - 14}" r="5" fill="${DARK.gold}"/>
  <circle cx="${QR_X + QR_BOX + 14}" cy="${QR_Y - 14}" r="5" fill="${DARK.gold}"/>
  <circle cx="${QR_X - 14}" cy="${QR_Y + QR_BOX + 14}" r="5" fill="${DARK.gold}"/>
  <circle cx="${QR_X + QR_BOX + 14}" cy="${QR_Y + QR_BOX + 14}" r="5" fill="${DARK.gold}"/>

  <!-- CTA principale -->
  <text x="${W / 2}" y="${QR_Y + QR_BOX + 68}"
        text-anchor="middle"
        font-family="'Georgia', serif"
        font-size="28" font-style="italic" font-weight="400"
        fill="${DARK.text}">
    Prenota un tavolo
  </text>

  <!-- CTA multilingua -->
  <text x="${W / 2}" y="${QR_Y + QR_BOX + 102}"
        text-anchor="middle"
        font-family="'Inter', Arial, sans-serif"
        font-size="14" font-weight="400"
        fill="${DARK.textMuted}" letter-spacing="0.3">
    Book a table · Réserver une table · Tisch reservieren
  </text>

  <!-- Footer -->
  <g transform="translate(${W / 2}, ${H - 82})" text-anchor="middle"
     font-family="'Inter', Arial, sans-serif">
    <line x1="-70" y1="0" x2="-18" y2="0" stroke="${DARK.gold}" stroke-opacity="0.3" stroke-width="1"/>
    <circle cx="0" cy="-1" r="3" fill="${DARK.gold}" fill-opacity="0.7"/>
    <line x1="18" y1="0" x2="70" y2="0" stroke="${DARK.gold}" stroke-opacity="0.3" stroke-width="1"/>
    <text y="26" font-size="11" letter-spacing="4.5" fill="${DARK.textMuted}">
      LECCE · PUGLIA · ITALIA
    </text>
    <text y="48" font-size="10" letter-spacing="2.5" fill="${DARK.textMuted}" fill-opacity="0.6">
      Lun–Sab  07:00–23:00
    </text>
  </g>
</svg>`;
}

// ============================================================
// Poster BAMBOO — variante natural
// ============================================================
async function buildBambooSVG() {
  const { qrInner, qrScale } = await buildQrInner(BAMBOO.qrFg, BAMBOO.qrBg);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <!-- Sfondo caldo crema -->
    <linearGradient id="bgGradB" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8f4ec"/>
      <stop offset="100%" stop-color="${BAMBOO.bg}"/>
    </linearGradient>
    <!-- Alone verde bamboo in alto -->
    <radialGradient id="glowB1" cx="50%" cy="8%" r="55%">
      <stop offset="0%" stop-color="${BAMBOO.green}" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="${BAMBOO.green}" stop-opacity="0"/>
    </radialGradient>
    <!-- Alone wood in basso -->
    <radialGradient id="glowB2" cx="50%" cy="95%" r="45%">
      <stop offset="0%" stop-color="${BAMBOO.wood}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${BAMBOO.wood}" stop-opacity="0"/>
    </radialGradient>
    <!-- Gradient verde per titolo -->
    <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BAMBOO.greenDeep}"/>
      <stop offset="100%" stop-color="${BAMBOO.green}"/>
    </linearGradient>
  </defs>

  <!-- Sfondo -->
  <rect width="${W}" height="${H}" fill="url(#bgGradB)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB1)"/>
  <rect width="${W}" height="${H}" fill="url(#glowB2)"/>

  <!-- Cornice decorativa doppia — in verde scuro -->
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none"
        stroke="${BAMBOO.greenDeep}" stroke-opacity="0.20" stroke-width="1.2"/>
  <rect x="37" y="37" width="${W - 74}" height="${H - 74}" fill="none"
        stroke="${BAMBOO.wood}" stroke-opacity="0.28" stroke-width="0.8"/>

  <!-- Angoli decorativi in wood -->
  <!-- TL -->
  <line x1="24" y1="80" x2="24" y2="24" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <line x1="24" y1="24" x2="80" y2="24" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <!-- TR -->
  <line x1="${W - 24}" y1="80" x2="${W - 24}" y2="24" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <line x1="${W - 80}" y1="24" x2="${W - 24}" y2="24" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <!-- BL -->
  <line x1="24" y1="${H - 80}" x2="24" y2="${H - 24}" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <line x1="24" y1="${H - 24}" x2="80" y2="${H - 24}" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <!-- BR -->
  <line x1="${W - 24}" y1="${H - 80}" x2="${W - 24}" y2="${H - 24}" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>
  <line x1="${W - 80}" y1="${H - 24}" x2="${W - 24}" y2="${H - 24}" stroke="${BAMBOO.green}" stroke-opacity="0.75" stroke-width="2.5"/>

  <!-- Motivo bamboo stilizzato sinistra -->
  <g stroke="${BAMBOO.green}" stroke-opacity="0.12" stroke-width="3" fill="none">
    <line x1="62" y1="60" x2="62" y2="${H - 60}"/>
    <line x1="72" y1="60" x2="72" y2="${H - 60}"/>
    <line x1="62" y1="200" x2="72" y2="200"/>
    <line x1="62" y1="380" x2="72" y2="380"/>
    <line x1="62" y1="560" x2="72" y2="560"/>
    <line x1="62" y1="740" x2="72" y2="740"/>
    <line x1="62" y1="920" x2="72" y2="920"/>
  </g>
  <!-- Motivo bamboo stilizzato destra -->
  <g stroke="${BAMBOO.green}" stroke-opacity="0.12" stroke-width="3" fill="none">
    <line x1="${W - 62}" y1="60" x2="${W - 62}" y2="${H - 60}"/>
    <line x1="${W - 72}" y1="60" x2="${W - 72}" y2="${H - 60}"/>
    <line x1="${W - 72}" y1="200" x2="${W - 62}" y2="200"/>
    <line x1="${W - 72}" y1="380" x2="${W - 62}" y2="380"/>
    <line x1="${W - 72}" y1="560" x2="${W - 62}" y2="560"/>
    <line x1="${W - 72}" y1="740" x2="${W - 62}" y2="740"/>
    <line x1="${W - 72}" y1="920" x2="${W - 62}" y2="920"/>
  </g>

  <!-- Eyebrow + separatore -->
  <g transform="translate(${W / 2}, 110)" text-anchor="middle" font-family="'Inter', 'Helvetica Neue', Arial, sans-serif">
    <line x1="-90" y1="0" x2="-22" y2="0" stroke="${BAMBOO.wood}" stroke-opacity="0.50" stroke-width="1"/>
    <circle cx="0" cy="-1" r="3.5" fill="${BAMBOO.wood}"/>
    <line x1="22" y1="0" x2="90" y2="0" stroke="${BAMBOO.wood}" stroke-opacity="0.50" stroke-width="1"/>
    <text y="26" font-size="13" letter-spacing="5.5" fill="${BAMBOO.greenDeep}" fill-opacity="0.75" font-weight="600">
      COCKTAIL BAR · LECCE
    </text>
  </g>

  <!-- Titolo BAMBOO -->
  <text x="${W / 2}" y="228"
        text-anchor="middle"
        font-family="'Georgia', 'Times New Roman', serif"
        font-size="108" font-weight="700" letter-spacing="5"
        fill="url(#greenGrad)">
    BAMBOO
  </text>

  <!-- Linea sottotitolo -->
  <line x1="${W / 2 - 140}" y1="255" x2="${W / 2 + 140}" y2="255"
        stroke="${BAMBOO.wood}" stroke-opacity="0.28" stroke-width="1"/>

  <!-- Testo intro -->
  <text x="${W / 2}" y="295"
        text-anchor="middle"
        font-family="'Georgia', serif"
        font-size="18" font-style="italic" font-weight="300"
        fill="${BAMBOO.textMuted}" letter-spacing="1">
    Prenota il tuo tavolo
  </text>

  <!-- Riquadro QR con bordo verde -->
  <rect x="${QR_X - 28}" y="${QR_Y - 28}" width="${QR_BOX + 56}" height="${QR_BOX + 56}"
        fill="${BAMBOO.qrBg}" rx="20"
        stroke="${BAMBOO.green}" stroke-opacity="0.20" stroke-width="1.5"/>

  <!-- QR code centrato -->
  <g transform="translate(${QR_X} ${QR_Y}) scale(${qrScale})">
    ${qrInner}
  </g>

  <!-- Pallini decorativi agli angoli QR -->
  <circle cx="${QR_X - 14}" cy="${QR_Y - 14}" r="5" fill="${BAMBOO.wood}"/>
  <circle cx="${QR_X + QR_BOX + 14}" cy="${QR_Y - 14}" r="5" fill="${BAMBOO.wood}"/>
  <circle cx="${QR_X - 14}" cy="${QR_Y + QR_BOX + 14}" r="5" fill="${BAMBOO.wood}"/>
  <circle cx="${QR_X + QR_BOX + 14}" cy="${QR_Y + QR_BOX + 14}" r="5" fill="${BAMBOO.wood}"/>

  <!-- CTA principale -->
  <text x="${W / 2}" y="${QR_Y + QR_BOX + 68}"
        text-anchor="middle"
        font-family="'Georgia', serif"
        font-size="28" font-style="italic" font-weight="400"
        fill="${BAMBOO.text}">
    Prenota un tavolo
  </text>

  <!-- CTA multilingua -->
  <text x="${W / 2}" y="${QR_Y + QR_BOX + 102}"
        text-anchor="middle"
        font-family="'Inter', Arial, sans-serif"
        font-size="14" font-weight="400"
        fill="${BAMBOO.textMuted}" letter-spacing="0.3">
    Book a table · Réserver une table · Tisch reservieren
  </text>

  <!-- Footer -->
  <g transform="translate(${W / 2}, ${H - 82})" text-anchor="middle"
     font-family="'Inter', Arial, sans-serif">
    <line x1="-70" y1="0" x2="-18" y2="0" stroke="${BAMBOO.wood}" stroke-opacity="0.40" stroke-width="1"/>
    <circle cx="0" cy="-1" r="3" fill="${BAMBOO.wood}" fill-opacity="0.8"/>
    <line x1="18" y1="0" x2="70" y2="0" stroke="${BAMBOO.wood}" stroke-opacity="0.40" stroke-width="1"/>
    <text y="26" font-size="11" letter-spacing="4.5" fill="${BAMBOO.textMuted}">
      LECCE · PUGLIA · ITALIA
    </text>
    <text y="48" font-size="10" letter-spacing="2.5" fill="${BAMBOO.textMuted}" fill-opacity="0.70">
      Lun–Sab  07:00–23:00
    </text>
  </g>
</svg>`;
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('Generating branded QR posters for Bamboo Lecce...');
  console.log(`URL: ${APP_URL}\n`);

  // --- DARK variant ---
  const darkSvg = await buildDarkSVG();
  const darkSvgPath = path.join(OUT_DIR, 'bamboo-app-qr-dark.svg');
  const darkPngPath = path.join(OUT_DIR, 'bamboo-app-qr-dark.png');

  fs.writeFileSync(darkSvgPath, darkSvg, 'utf8');
  console.log(`SVG (dark): ${darkSvgPath}`);

  await sharp(Buffer.from(darkSvg))
    .resize({ width: PRINT_WIDTH })
    .png({ quality: 100 })
    .toFile(darkPngPath);
  console.log(`PNG (dark): ${darkPngPath} (${PRINT_WIDTH}px, ~300 DPI)`);

  // --- BAMBOO (natural) variant ---
  const bambooSvg = await buildBambooSVG();
  const bambooSvgPath = path.join(OUT_DIR, 'bamboo-app-qr-bamboo.svg');
  const bambooPngPath = path.join(OUT_DIR, 'bamboo-app-qr-bamboo.png');

  fs.writeFileSync(bambooSvgPath, bambooSvg, 'utf8');
  console.log(`SVG (bamboo): ${bambooSvgPath}`);

  await sharp(Buffer.from(bambooSvg))
    .resize({ width: PRINT_WIDTH })
    .png({ quality: 100 })
    .toFile(bambooPngPath);
  console.log(`PNG (bamboo): ${bambooPngPath} (${PRINT_WIDTH}px, ~300 DPI)`);

  console.log('\nDone! 4 files generated in public/qr/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
