/**
 * Generates public/og-image.jpg — 1200×630 branded OG card for J. Ferré Joyería.
 *
 * Layout:
 *   - Dark forest (#1a2420) background
 *   - Brand icon centered in the upper half
 *   - Gold title + tagline text below
 *   - Darker strip at the bottom with domain
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
const BG = '#1a2420';        // dark forest
const STRIP = '#0d1310';     // darker footer strip
const GOLD = '#D4AF37';      // brand gold

// --- 1. Resize favicon to fit inside 160×160 ---
const logoPath = join(root, 'public/original/jferre_favicon.png');
const logoResized = await sharp(logoPath)
  .resize({ width: 160, height: 160, fit: 'inside' })
  .png()
  .toBuffer();

const logoMeta = await sharp(logoResized).metadata();
const logoW = logoMeta.width;
const logoH = logoMeta.height;

// Center logo horizontally, ~32% from top
const logoLeft = Math.round((WIDTH - logoW) / 2);
const logoTop = Math.round(HEIGHT * 0.32 - logoH / 2);

// --- 2. Build SVG overlay: background + strips + text ---
const textY = logoTop + logoH + 48;
const stripH = 72;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>

  <!-- Gold top accent bar -->
  <rect x="0" y="0" width="${WIDTH}" height="4" fill="${GOLD}" opacity="0.8"/>

  <!-- Bottom strip -->
  <rect x="0" y="${HEIGHT - stripH}" width="${WIDTH}" height="${stripH}" fill="${STRIP}"/>

  <!-- Gold divider above strip -->
  <rect x="0" y="${HEIGHT - stripH}" width="${WIDTH}" height="2" fill="${GOLD}" opacity="0.6"/>

  <!-- Brand name -->
  <text
    x="${WIDTH / 2}"
    y="${textY}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="52"
    font-weight="400"
    fill="${GOLD}"
    fill-opacity="0.95"
    text-anchor="middle"
    dominant-baseline="hanging"
    letter-spacing="3"
  >J. Ferré Joyería</text>

  <!-- Tagline -->
  <text
    x="${WIDTH / 2}"
    y="${textY + 72}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="22"
    font-weight="300"
    fill="white"
    fill-opacity="0.70"
    text-anchor="middle"
    dominant-baseline="hanging"
    letter-spacing="4"
  >ELEGANCIA EN CADA DETALLE</text>

  <!-- Domain in strip -->
  <text
    x="${WIDTH / 2}"
    y="${HEIGHT - stripH / 2}"
    font-family="Arial, Helvetica, sans-serif"
    font-size="18"
    font-weight="400"
    fill="white"
    fill-opacity="0.75"
    text-anchor="middle"
    dominant-baseline="middle"
    letter-spacing="2"
  >jferrejoyeria.com</text>
</svg>
`.trim();

// --- 3. Composite: SVG base + icon on top ---
const outputPath = join(root, 'public/og-image.jpg');

await sharp(Buffer.from(svg))
  .composite([{ input: logoResized, top: logoTop, left: logoLeft }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(outputPath);

console.log(`✓ OG image generated: public/og-image.jpg (${WIDTH}×${HEIGHT})`);
