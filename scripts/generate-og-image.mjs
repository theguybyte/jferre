/**
 * Generates public/og-image.jpg — 1200×630 branded OG card.
 *
 * Layout:
 *   - Solid green (#006039) background
 *   - White logo centered in the upper half
 *   - Tagline text below the logo
 *   - Darker green bottom strip
 *
 * Run: node scripts/generate-og-image.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;
const PRIMARY = '#006039';
const DARK_STRIP = '#003d22';

// --- 1. Resize the white logo to fit inside a 520×128 box ---
const logoPath = join(root, 'public/original/golden_logo_white.png');
const logoResized = await sharp(logoPath)
  .resize({ width: 520, height: 128, fit: 'inside' })
  .png()
  .toBuffer();

const logoMeta = await sharp(logoResized).metadata();
const logoW = logoMeta.width;
const logoH = logoMeta.height;

// Logo centered horizontally, positioned at ~38% from the top
const logoLeft = Math.round((WIDTH - logoW) / 2);
const logoTop = Math.round(HEIGHT * 0.28 - logoH / 2);

// --- 2. Build SVG overlay: background + bottom strip + tagline ---
const taglineY = logoTop + logoH + 52;
const stripH = 72;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PRIMARY}"/>

  <!-- Bottom strip -->
  <rect x="0" y="${HEIGHT - stripH}" width="${WIDTH}" height="${stripH}" fill="${DARK_STRIP}"/>

  <!-- Tagline -->
  <text
    x="${WIDTH / 2}"
    y="${taglineY}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="38"
    font-weight="600"
    fill="white"
    fill-opacity="0.92"
    text-anchor="middle"
    dominant-baseline="hanging"
    letter-spacing="0.5"
  >Inversiones Inmobiliarias Premium</text>

  <!-- Sub-tagline -->
  <text
    x="${WIDTH / 2}"
    y="${taglineY + 58}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="24"
    font-weight="400"
    fill="white"
    fill-opacity="0.72"
    text-anchor="middle"
    dominant-baseline="hanging"
    letter-spacing="0.3"
  >Propiedades exclusivas en Córdoba, Argentina.</text>

  <!-- Bottom strip label -->
  <text
    x="${WIDTH / 2}"
    y="${HEIGHT - stripH / 2}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="20"
    font-weight="500"
    fill="white"
    fill-opacity="0.85"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="2"
  >goldenprop.com.ar</text>
</svg>
`.trim();

// --- 3. Composite: SVG base + white logo on top ---
const outputPath = join(root, 'public/og-image.jpg');

await sharp(Buffer.from(svg))
  .composite([
    {
      input: logoResized,
      top: logoTop,
      left: logoLeft,
    },
  ])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outputPath);

console.log(`✓ OG image generated: public/og-image.jpg (${WIDTH}×${HEIGHT})`);
