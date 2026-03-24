---
name: Favicon Generation Plan
description: Reusable step-by-step plan to generate all favicon assets for a Vite + React project using sharp and to-ico
type: reference
---

# Favicon Generation Plan (Vite + React + TypeScript stack)

## Prerequisites
- Source image: a square PNG at `public/original/jferre_favicon.png` (min 512×512 recommended)
- `sharp` already in devDependencies (installed via npm)

---

## Step 1 — Add `to-ico` to package.json

```bash
npm install --save-dev to-ico
```

---

## Step 2 — Create `scripts/generate-favicons.mjs`

```js
import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'public/original/jferre_favicon.png'); // ← change this
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
  name: '<App Name>',           // ← change this
  short_name: '<App Name>',     // ← change this
  icons: [
    { src: '/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
  ],
  theme_color: '#000000',       // ← change to brand color
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
<meta name="msapplication-TileColor" content="#000000" />
<meta name="theme-color" content="#000000" />
---------------------------------
`);
```

---

## Step 3 — Run the script

```bash
node scripts/generate-favicons.mjs
```

---

## Step 4 — Wire up in `index.html`

Paste the printed snippet inside `<head>`:

```html
<link rel="icon" type="image/x-icon" href="/favicons/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/favicons/site.webmanifest" />
<meta name="msapplication-TileImage" content="/favicons/mstile-150x150.png" />
<meta name="msapplication-TileColor" content="#000000" />
<meta name="theme-color" content="#000000" />
```

---

## Output files in `public/favicons/`

| File | Size |
|---|---|
| `favicon.ico` | 16, 32, 48 px (multi-size) |
| `favicon-16x16.png` | 16×16 |
| `favicon-32x32.png` | 32×32 |
| `favicon-48x48.png` | 48×48 |
| `apple-touch-icon.png` | 180×180 |
| `android-chrome-192x192.png` | 192×192 |
| `android-chrome-512x512.png` | 512×512 |
| `mstile-150x150.png` | 150×150 |
| `site.webmanifest` | JSON manifest |

---

## Customization checklist

- [ ] Replace `jferre_favicon.png` with actual source filename
- [ ] Replace `<App Name>` with app display name
- [ ] Replace `#000000` with brand primary color
