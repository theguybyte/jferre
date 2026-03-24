---
name: Open Graph Meta Tags Plan
description: Reusable plan to configure complete OG/Twitter meta tags and generate a branded 1200×630 OG image using sharp for any React + Vite project
type: reference
---

# Open Graph Meta Tags Plan (React + Vite + sharp)

## Goal
Configure all required meta tags so that links shared on WhatsApp, Facebook, LinkedIn, Twitter/X, and other social networks render a proper rich preview (title, description, and image card).

---

## Prerequisites
- White logo PNG at `public/original/solidus_logo_white.png` (wide format, e.g. 1560×384)
- `sharp` installed as a dev dependency (`npm install -D sharp`)
- Production domain known (e.g. `https://example.com`)

---

## Step 1 — Audit existing meta tags

Check `index.html` for these common gaps:

| Tag | Required by |
|---|---|
| `og:title` | All platforms |
| `og:description` | All platforms |
| `og:type` | All platforms |
| `og:url` | All platforms |
| `og:image` (absolute URL) | All platforms |
| `og:image:width` + `og:image:height` | Facebook, LinkedIn (avoids re-fetch) |
| `og:image:alt` | Accessibility + validators |
| `og:locale` | Facebook (e.g. `es_AR`, `en_US`) |
| `og:site_name` | LinkedIn |
| `twitter:card` → `summary_large_image` | Twitter/X |
| `twitter:title` | Twitter/X |
| `twitter:description` | Twitter/X |
| `twitter:image` (absolute URL) | Twitter/X |
| `twitter:image:alt` | Twitter/X |

---

## Step 2 — Create the OG image generation script

Create `scripts/generate-og-image.mjs`:

```js
/**
 * Generates public/og-image.jpg — 1200×630 branded OG card.
 * Run: node scripts/generate-og-image.mjs
 */

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;
const PRIMARY = '#REPLACE_WITH_BRAND_COLOR';       // e.g. '#0029FA'
const DARK_STRIP = '#REPLACE_WITH_DARKER_SHADE';   // e.g. '#001BBF'

// 1. Resize white logo to fit inside 520×128
const logoPath = join(root, 'public/original/solidus_logo_white.png');
const logoResized = await sharp(logoPath)
  .resize({ width: 520, height: 128, fit: 'inside' })
  .png()
  .toBuffer();

const logoMeta = await sharp(logoResized).metadata();
const logoW = logoMeta.width;
const logoH = logoMeta.height;

// Center logo horizontally, ~38% from top
const logoLeft = Math.round((WIDTH - logoW) / 2);
const logoTop = Math.round(HEIGHT * 0.28 - logoH / 2);

const taglineY = logoTop + logoH + 52;
const stripH = 72;

// 2. SVG: background + bottom strip + text
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PRIMARY}"/>
  <rect x="0" y="${HEIGHT - stripH}" width="${WIDTH}" height="${stripH}" fill="${DARK_STRIP}"/>
  <text
    x="${WIDTH / 2}" y="${taglineY}"
    font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="600"
    fill="white" fill-opacity="0.92" text-anchor="middle" dominant-baseline="hanging"
  >REPLACE WITH TAGLINE</text>
  <text
    x="${WIDTH / 2}" y="${taglineY + 58}"
    font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="400"
    fill="white" fill-opacity="0.72" text-anchor="middle" dominant-baseline="hanging"
  >REPLACE WITH SUB-TAGLINE</text>
  <text
    x="${WIDTH / 2}" y="${HEIGHT - stripH / 2}"
    font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="500"
    fill="white" fill-opacity="0.85" text-anchor="middle" dominant-baseline="middle"
    letter-spacing="2"
  >REPLACE WITH DOMAIN</text>
</svg>
`.trim();

// 3. Composite SVG + logo → JPEG
await sharp(Buffer.from(svg))
  .composite([{ input: logoResized, top: logoTop, left: logoLeft }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(join(root, 'public/og-image.jpg'));

console.log(`✓ OG image generated: public/og-image.jpg (${WIDTH}×${HEIGHT})`);
```

Run it:
```bash
node scripts/generate-og-image.mjs
```

Verify output: `public/og-image.jpg` at 1200×630.

---

## Step 3 — Update index.html

Replace the OG/Twitter block in `<head>` with the complete set:

```html
<!-- Open Graph -->
<meta property="og:title" content="SITE TITLE" />
<meta property="og:description" content="SITE DESCRIPTION" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com" />
<meta property="og:image" content="https://example.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="DESCRIPTIVE ALT TEXT" />
<meta property="og:locale" content="es_AR" />
<meta property="og:site_name" content="SITE NAME" />

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="SITE TITLE" />
<meta name="twitter:description" content="SITE DESCRIPTION" />
<meta name="twitter:image" content="https://example.com/og-image.jpg" />
<meta name="twitter:image:alt" content="DESCRIPTIVE ALT TEXT" />
```

---

## Step 4 — Validate

| Platform | Validator URL |
|---|---|
| Facebook / WhatsApp | https://developers.facebook.com/tools/debug/ |
| Twitter / X | https://cards-dev.twitter.com/validator |
| LinkedIn | https://www.linkedin.com/post-inspector/ |
| General | https://www.opengraph.xyz/ |

> **Note:** Facebook caches OG data. After deploying changes, use the Facebook debugger's "Scrape Again" button to bust the cache.

---

## Checklist

- [ ] `sharp` installed as dev dependency
- [ ] White logo PNG available at `public/original/`
- [ ] `scripts/generate-og-image.mjs` created and customized
- [ ] Script run successfully → `public/og-image.jpg` exists at 1200×630
- [ ] All 14 OG/Twitter tags present in `index.html`
- [ ] `og:image` URL is absolute (not a relative path)
- [ ] Validated on at least Facebook debugger and opengraph.xyz
