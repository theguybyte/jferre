#!/usr/bin/env node
/**
 * Responsive image generation script
 *
 * Reads every source image from public/images/ and generates:
 *   - <name>-320.{avif,webp,jpg}
 *   - <name>-640.{avif,webp,jpg}
 *   - <name>-1024.{avif,webp,jpg}
 *   - <name>-1600.{avif,webp,jpg}
 *
 * Also writes src/data/lqip.json with tiny base-64 placeholders for
 * optional blur-up (LQIP) support in the ResponsiveImage component.
 *
 * Usage:
 *   npm run generate-images
 */

import sharp from 'sharp';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMAGES_DIR = path.join(ROOT, 'public/images');
const LQIP_OUT = path.join(ROOT, 'src/data/lqip.json');

const WIDTHS = [320, 640, 1024, 1600];
const SOURCE_EXTS = new Set(['.jpg', '.jpeg', '.png']);

/** Skip files that are already generated outputs (e.g. hero-couple-640.webp) */
function isSourceImage(filename) {
  return !/(320|640|1024|1600)\.(avif|webp|jpg|jpeg|png)$/.test(filename);
}

async function generateLqip(inputPath) {
  const buffer = await sharp(inputPath)
    .resize(20)
    .jpeg({ quality: 40 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}

async function processImage(inputPath, baseName) {
  const lqip = await generateLqip(inputPath);
  let generated = 0;

  for (const width of WIDTHS) {
    const base = path.join(IMAGES_DIR, `${baseName}-${width}`);

    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .avif({ quality: 72 })
      .toFile(`${base}.avif`);

    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(`${base}.webp`);

    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(`${base}.jpg`);

    generated++;
    process.stdout.write(`  ✓ ${baseName}-${width}.{avif,webp,jpg}\n`);
  }

  return { lqip, generated };
}

async function main() {
  const entries = await readdir(IMAGES_DIR);
  const sources = entries.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return SOURCE_EXTS.has(ext) && isSourceImage(f);
  });

  if (sources.length === 0) {
    console.log('No source images found in public/images/');
    return;
  }

  const lqipMap = {};
  let totalFiles = 0;

  for (const filename of sources) {
    const inputPath = path.join(IMAGES_DIR, filename);
    const baseName = path.basename(filename, path.extname(filename));
    console.log(`\nProcessing: ${filename}`);

    const { lqip, generated } = await processImage(inputPath, baseName);
    lqipMap[`/images/${filename}`] = lqip;
    totalFiles += generated * 3; // 3 formats per width
  }

  // Write LQIP map to src/data/ so it can be imported as a module
  await mkdir(path.dirname(LQIP_OUT), { recursive: true });
  await writeFile(LQIP_OUT, JSON.stringify(lqipMap, null, 2));

  console.log(`\nWrote LQIP data → src/data/lqip.json`);
  console.log(`Done! ${sources.length} image(s) processed, ${totalFiles} files generated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
