import sharp from 'sharp';
import { readdir, access } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const INPUT_EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const images = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      images.push(...(await collectImages(fullPath)));
    } else if (INPUT_EXTS.has(extname(entry.name).toLowerCase())) {
      images.push(fullPath);
    }
  }
  return images;
}

async function main() {
  const images = await collectImages(publicDir);

  if (images.length === 0) {
    console.log('No images found in public/');
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const input of images) {
    const ext = extname(input);
    const output = input.slice(0, -ext.length) + '.webp';

    if (await exists(output)) {
      console.log(`  skip  ${input.replace(publicDir, '')} (already exists)`);
      skipped++;
      continue;
    }

    await sharp(input)
      .webp({ quality: 82, effort: 6 })
      .toFile(output);

    console.log(`  done  ${input.replace(publicDir, '')} → ${basename(output)}`);
    converted++;
  }

  console.log(`\nConverted: ${converted}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
