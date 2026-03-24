import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'public/original/golden_favicon.png');
const outDir = resolve(root, 'public/favicons');

mkdirSync(outDir, { recursive: true });

const pngSizes = [
  { name: 'favicon-16x16.png',          size: 16  },
  { name: 'favicon-32x32.png',          size: 32  },
  { name: 'favicon-48x48.png',          size: 48  },
  { name: 'apple-touch-icon.png',       size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'mstile-150x150.png',         size: 150 },
];

console.log('Generating PNGs...');
for (const { name, size } of pngSizes) {
  await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
    .png()
    .toFile(resolve(outDir, name));
  console.log(`  ✓ ${name} (${size}×${size})`);
}

console.log('Generating favicon.ico (16, 32, 48)...');
const icoBuffers = await Promise.all(
  [16, 32, 48].map(size =>
    sharp(src)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 }, kernel: 'lanczos3' })
      .png()
      .toBuffer()
  )
);
const icoBuffer = await toIco(icoBuffers);
writeFileSync(resolve(outDir, 'favicon.ico'), icoBuffer);
console.log('  ✓ favicon.ico (16, 32, 48)');

const manifest = {
  name: 'Golden Prop',
  short_name: 'Golden Prop',
  icons: [
    { src: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  theme_color: '#006039',
  background_color: '#ffffff',
  display: 'standalone',
};
writeFileSync(resolve(outDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
console.log('  ✓ site.webmanifest');

console.log('\nAll favicon files generated in public/favicons/');

console.log(`
--- Copy this into your <head> ---
<link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/favicons/site.webmanifest" />
<meta name="msapplication-TileImage" content="/favicons/mstile-150x150.png" />
<meta name="msapplication-TileColor" content="#006039" />
<meta name="theme-color" content="#006039" />
---------------------------------
`);
