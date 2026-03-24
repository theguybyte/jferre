// scripts/optimize-logos.mjs
import sharp    from 'sharp';
import { statSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// ─── CONFIG ────────────────────────────────────────────────────────────────
// cssH = largest CSS display height across all usages (navbar h-10=40, footer h-12=48)
const logos = [
  {
    src:  'public/original/golden_prop.png',
    webp: 'public/images/logo.webp',
    png:  'public/images/logo.png',
    cssH: 48, // footer h-12; navbar h-10 will CSS-scale down
  },
  {
    src:  'public/original/golden_logo_white.png',
    webp: 'public/images/logo-white.webp',
    png:  'public/images/logo-white.png',
    cssH: 48,
  },
];
// ─── END CONFIG ─────────────────────────────────────────────────────────────

for (const logo of logos) {
  const meta    = await sharp(logo.src).metadata();
  const targetH = logo.cssH * 2;
  const targetW = Math.round(targetH * (meta.width / meta.height));

  mkdirSync(dirname(logo.webp), { recursive: true });

  const hasAlpha = meta.channels === 4;

  await sharp(logo.src)
    .resize(targetW, targetH)
    .webp(hasAlpha ? { lossless: true } : { quality: 85 })
    .toFile(logo.webp);

  await sharp(logo.src)
    .resize(targetW, targetH)
    .png({ compressionLevel: 9 })
    .toFile(logo.png);

  const origKB = Math.round(statSync(logo.src).size / 1024);
  const webpKB = Math.round(statSync(logo.webp).size / 1024 * 10) / 10;
  const pngKB  = Math.round(statSync(logo.png).size  / 1024 * 10) / 10;
  const saving = Math.round((1 - webpKB / origKB) * 100);

  console.log(`${logo.src}`);
  console.log(`  original : ${origKB} KB  (${meta.width}×${meta.height})`);
  console.log(`  webp     : ${webpKB} KB  (${targetW}×${targetH})  −${saving}%`);
  console.log(`  png      : ${pngKB} KB`);
}
