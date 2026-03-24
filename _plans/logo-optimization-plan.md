# Logo Optimization Plan

A reusable guide for optimizing logo assets in web projects.
Covers auditing, resizing, format conversion, and correct component integration.

---

## When to use this guide

- You have PNG/JPEG logo files larger than ~10 KB
- The source file resolution is bigger than what the browser actually renders
- You want retina-sharp logos with minimal network cost
- You are replacing placeholder text/icon logos with real brand assets

**Skip this guide entirely if your logo is already an SVG.** SVG is
resolution-independent and typically under 5 KB. Just embed it directly.

---

## Concepts

### Why logos end up oversized

Design tools (Figma, Illustrator, Photoshop) export at canvas resolution —
often 1500 px+ wide — intended for print or general reuse. A navbar logo
renders at 120–160 px wide on screen. Serving a 1560 px file for a 130 px
display wastes 10–15× bandwidth.

### The 2× retina rule

CSS pixels are logical. A device with a 2× pixel ratio (most modern phones
and MacBooks) renders 1 CSS pixel as 2 physical pixels. To look sharp on
those screens, the image file should be **2× the CSS display size**.

```
file width  = CSS display width  × 2
file height = CSS display height × 2
```

### Format choice

| Situation | Recommended format | Why |
|---|---|---|
| Logo with transparency, sharp edges, flat colors | **WebP lossless** | No artifacts, ~60–90% smaller than PNG |
| Logo without transparency, photographic | **WebP lossy** (quality 85) | Best size/quality ratio |
| Fallback for very old browsers | **PNG** | Universal support |
| Already vector | **SVG** | Skip optimization entirely |

> AVIF offers even better compression than WebP but has lower browser support
> and much slower encoding. Prefer WebP unless you have a specific AVIF need.

---

## Prerequisites

**Node.js** must be available. The `sharp` package does all processing.

```bash
npm install --save-dev sharp
```

`sharp` uses native binaries — it is fast and requires no external tools
(no ImageMagick, no ffmpeg).

---

## Step 1 — Preserve originals

Never process in-place. Create a dedicated folder for source files:

```
public/
  original/      ← untouched originals, committed to git
  images/        ← optimized output, also committed
```

If the project already has originals elsewhere, copy them to `public/original/`
before proceeding.

---

## Step 2 — Audit the originals

Run this once to understand what you are working with:

```bash
node -e "
const sharp = require('sharp');
const fs    = require('fs');
const files = fs.readdirSync('public/original').filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f));
(async () => {
  for (const f of files) {
    const p = 'public/original/' + f;
    const m = await sharp(p).metadata();
    const kb = Math.round(fs.statSync(p).size / 1024);
    console.log(f.padEnd(30), m.width + 'x' + m.height, m.format, m.channels + 'ch', kb + 'KB');
  }
})();
"
```

Note down: **width**, **height**, and **file size** for each logo.

---

## Step 3 — Determine display size

Find every place the logo is used in the codebase and note its CSS height.

```bash
# Search for logo references
grep -rn "logo\|Logo" src/ --include="*.tsx" --include="*.vue" --include="*.html" -l
```

Then check what CSS height is applied at each usage:

| Location | CSS class / style | CSS px | File px (×2) |
|---|---|---|---|
| Navbar | `h-8` | 32 px | **64 px** |
| Footer | `h-8` | 32 px | **64 px** |
| Hero section | `h-12` | 48 px | **96 px** |

If the logo appears at multiple sizes, generate one file per size **or**
generate at the largest size and let CSS scale it down (no quality loss going
smaller, only file size is slightly larger than ideal).

**Calculate target dimensions:**

```
targetH = maxCssHeight × 2
targetW = Math.round(targetH × (originalW / originalH))
```

---

## Step 4 — Run the optimization script

Save as `scripts/optimize-logos.mjs` and adapt the config block at the top.

```js
// scripts/optimize-logos.mjs
import sharp    from 'sharp';
import { statSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// ─── CONFIG ────────────────────────────────────────────────────────────────
// One entry per logo variant. Remove entries that don't apply.
const logos = [
  {
    src:  'public/original/logo.png',
    webp: 'public/images/logo.webp',
    png:  'public/images/logo.png',
    // CSS display height in px (the largest size used in the UI)
    cssH: 32,
  },
  {
    src:  'public/original/logo-white.png',
    webp: 'public/images/logo-white.webp',
    png:  'public/images/logo-white.png',
    cssH: 32,
  },
];
// ─── END CONFIG ─────────────────────────────────────────────────────────────

for (const logo of logos) {
  const meta    = await sharp(logo.src).metadata();
  const targetH = logo.cssH * 2;
  const targetW = Math.round(targetH * (meta.width / meta.height));

  mkdirSync(dirname(logo.webp), { recursive: true });

  // Detect whether the source has transparency
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
```

Run it:

```bash
node scripts/optimize-logos.mjs
```

---

## Step 5 — Integrate in components

### React / TSX (any framework with JSX)

Use `<picture>` to serve WebP with a PNG fallback.
Set `width` and `height` to the **CSS logical pixels** (not the file pixels)
so the browser reserves the correct space before the image loads (prevents CLS).

```tsx
// cssH = 32px → width = 32 × aspect, height = 32
<picture>
  <source srcSet="/images/logo.webp" type="image/webp" />
  <img
    src="/images/logo.png"
    alt="Company name"
    width={130}    // CSS display width  (file width  ÷ 2)
    height={32}    // CSS display height (file height ÷ 2)
    className="h-8 w-auto"
  />
</picture>
```

### Next.js

Use the built-in `<Image>` component — it handles WebP conversion,
lazy loading, and size hints automatically.

```tsx
import Image from 'next/image';
import logoSrc from '@/public/images/logo.png';

<Image
  src={logoSrc}
  alt="Company name"
  height={32}        // CSS display height
  width={130}        // CSS display width
  className="h-8 w-auto"
  priority           // add for above-the-fold logos (no lazy load)
/>
```

> With Next.js `<Image>`, you can skip generating WebP manually —
> Next.js serves WebP/AVIF automatically via its image optimization API.
> Still resize to 2× the display size to avoid serving oversized source files.

### Plain HTML

```html
<picture>
  <source srcset="/images/logo.webp" type="image/webp" />
  <img
    src="/images/logo.png"
    alt="Company name"
    width="130"
    height="32"
    style="height: 2rem; width: auto;"
  />
</picture>
```

### Vue / Nuxt

```vue
<picture>
  <source srcset="/images/logo.webp" type="image/webp" />
  <img
    src="/images/logo.png"
    alt="Company name"
    :width="130"
    :height="32"
    class="h-8 w-auto"
  />
</picture>
```

---

## Step 6 — Verify

After integrating, open DevTools → Network tab → filter by "Img":

- Confirm the `.webp` file is being requested (not the original PNG)
- Confirm the file size matches your optimized output
- Zoom in on a retina display (or use DevTools device emulation at 2×) —
  the logo should look sharp, not blurry

---

## Troubleshooting

**Logo looks blurry on retina screens**
→ The file is smaller than 2× the CSS display size. Re-run the script with
`cssH` doubled, or increase `cssH` to the correct value.

**Logo appears stretched or squished**
→ `width` and `height` on `<img>` are wrong. They must match the CSS display
dimensions (logical pixels), not the file dimensions. Recalculate as
`fileW ÷ 2` and `fileH ÷ 2`.

**WebP not being served, browser loads PNG fallback**
→ This is correct behavior on old browsers. No action needed.

**`sharp` install fails on CI/Docker**
→ Pin the platform: `npm install --save-dev --platform=linux --arch=x64 sharp`
or add `sharp` to `optionalDependencies`.

**Script throws "Cannot find module 'sharp'"**
→ Run the script from the project root, not from `scripts/`. Or use
`node --experimental-vm-modules` if on older Node.

---

## Decision tree

```
Is the logo an SVG?
  YES → embed directly, no optimization needed
  NO  ↓

Does it have transparency (PNG with alpha)?
  YES → WebP lossless  (+  PNG fallback)
  NO  → WebP lossy q85 (+  PNG fallback)

Is this a Next.js project?
  YES → use <Image> component, skip manual WebP generation
  NO  → use <picture> + <source type="image/webp">

Is the logo used above the fold (navbar, hero)?
  YES → add  loading="eager"  /  priority  (Next.js)
  NO  → default lazy loading is fine
```

---

## Quick reference — Tailwind height → px

| Class | CSS px | File px (×2) |
|---|---|---|
| `h-6` | 24 px | 48 px |
| `h-7` | 28 px | 56 px |
| `h-8` | 32 px | 64 px |
| `h-9` | 36 px | 72 px |
| `h-10` | 40 px | 80 px |
| `h-12` | 48 px | 96 px |
| `h-16` | 64 px | 128 px |

---

## Results log

Fill this in after running the script on each project.

| Project | File | Original | WebP | PNG | Saving |
|---|---|---|---|---|---|
| DECLASES | `logo.png` (blue) | 46 KB | 6.4 KB | 8.8 KB | −86% |
| DECLASES | `logo-white.png` | 46 KB | 4.0 KB | 5.7 KB | −91% |
| SOLIDUS | `solidus_logo.png` (blue) | 36 KB | 6.9 KB | 9.8 KB | −81% |
| SOLIDUS | `solidus_logo_white.png` | 37 KB | 4.5 KB | 6.8 KB | −88% |
| GOLDEN PROP | `golden_prop.png` (colored) | 110 KB | 10.9 KB | 13.4 KB | −90% |
| GOLDEN PROP | `golden_logo_white.png` | 114 KB | 9.8 KB | 12.4 KB | −91% |
