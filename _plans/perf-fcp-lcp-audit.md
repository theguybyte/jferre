# Performance Audit — FCP & LCP Improvement Plan

## Context
Current scores: mobile 70–76, desktop 90–95.
Goal: push mobile to 85+ and desktop to 98+.
The project already has a solid `ResponsiveImage` component (AVIF/WebP/JPEG srcset, IntersectionObserver lazy-load) and pre-generated image variants at 320/640/1024/1600 widths in `public/images/`. The gaps are in *usage* (many components bypass it) and in font/JS loading strategy.

---

## LCP Element Identification

| Page | LCP Candidate | Current State |
|---|---|---|
| Home `/` | `/images/hero-couple.jpg` in `Hero.tsx:95` | `ResponsiveImage` + `eager` ✓ — missing `fetchpriority="high"` |
| PropertyDetail `/propiedad/:id` | First gallery image in `PropertyGallery.tsx:147` | Plain `<img loading="eager">` — no srcset, no AVIF/WebP, no `fetchpriority` |

---

## Grouped Task List by Impact

---

### 🔴 GROUP 1 — Critical (Direct FCP + LCP impact)

#### 1a. Fix font loading (FCP)
**Problem:** Google Fonts loaded via `@import` in `src/index.css:1` — blocks CSS parsing.
**Fix:**
- Remove `@import` from `src/index.css`
- Add to `index.html` `<head>`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" />
  ```

**Files:** `index.html`, `src/index.css`
**Expected gain:** 200–400 ms FCP improvement (removes a synchronous render block).

---

#### 1b. Add `fetchpriority="high"` to Home LCP image
**Problem:** Hero image uses `ResponsiveImage` with `eager` but no browser priority hint.
**Fix:** Pass `fetchpriority="high"` to `<ResponsiveImage>` in `Hero.tsx`. Forward the prop to `<img>` in `ResponsiveImage.tsx` if not already present.

**Files:** `src/components/sections/Hero.tsx`, `src/components/ResponsiveImage.tsx`
**Expected gain:** 100–300 ms LCP improvement on Home.

---

#### 1c. Fix PropertyDetail LCP image (PropertyGallery hero)
**Problem:** `PropertyGallery.tsx:147` uses plain `<img src={heroImage} loading="eager" />` — no srcset, no AVIF/WebP, no `fetchpriority`.
**Fix:** Replace the desktop hero `<img>` (and mobile first-slide `<img>`) with `<ResponsiveImage fetchpriority="high" eager>`. Verify responsive variants exist for property images (`/images/property-X-320.avif`, etc.).

**Files:** `src/components/PropertyGallery.tsx`, `src/components/ResponsiveImage.tsx`
**Expected gain:** Largest single gain on PropertyDetail — potentially 500–1000 ms LCP on mobile.

---

### 🟠 GROUP 2 — High Impact (JS bundle / FCP)

#### 2a. Lazy-load all routes with React.lazy + Suspense
**Problem:** `src/App.tsx:14–19` imports all 6 pages eagerly — 1935 lines of JS parsed before first paint.
**Fix:** Convert to:
```tsx
const Properties = React.lazy(() => import('@/pages/Properties'));
const PropertyDetail = React.lazy(() => import('@/pages/PropertyDetail'));
// etc. for Agents, Publish, Contact — keep Home eager
```
Wrap `<Routes>` in `<Suspense fallback={<div />}>`.

**Files:** `src/App.tsx`
**Expected gain:** Cuts initial JS parse by ~60%. Big FCP win especially on mobile.

---

#### 2b. Add manualChunks in vite.config.ts
**Problem:** No `rollupOptions.output.manualChunks` — everything lands in one bundle. Heavy libs (GSAP ~65 KB, Radix UI ~500 KB+, forms) not split.
**Fix:**
```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-gsap': ['gsap'],
        'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select' /* etc. */],
        'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
      },
    },
  },
},
```

**Files:** `vite.config.ts`
**Expected gain:** Better caching + parallel chunk downloads on repeat visits.

---

### 🟡 GROUP 3 — Medium Impact (image coverage)

#### 3a. Fix Properties listing page images
**Problem:** `src/pages/Properties.tsx:422–425` uses plain `<img src={property.image} />` — no lazy, no srcset, no modern formats. Multiple cards load simultaneously.
**Fix:** Replace with `<ResponsiveImage>` (lazy, sizes `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw`).

**Files:** `src/pages/Properties.tsx`

---

#### 3b. Fix remaining unoptimized section images
Plain `<img>` tags with no optimization in:
- `src/components/sections/AboutUs.tsx:91, 100`
- `src/components/sections/ContactSection.tsx:89`
- `src/components/sections/PublishCTA.tsx:69`
- `src/components/sections/Agents.tsx:146`
- `src/pages/PropertyDetail.tsx:161` (agent profile photo)

**Fix:** Replace with `<ResponsiveImage>` (all lazy since below fold) or at minimum `loading="lazy" decoding="async"`.

---

### 🟢 GROUP 4 — Low Impact / Polish

#### 4a. Add `<link rel="preload">` for Hero image in index.html
```html
<link rel="preload" as="image"
      href="/images/hero-couple-1600.avif"
      imagesrcset="/images/hero-couple-320.avif 320w, /images/hero-couple-640.avif 640w, /images/hero-couple-1024.avif 1024w, /images/hero-couple-1600.avif 1600w"
      imagesizes="100vw" fetchpriority="high" />
```
Tells the browser about the LCP image before the JS bundle executes.

**Files:** `index.html`

---

#### 4b. Consolidate GSAP plugin registration
**Problem:** `ScrollTrigger.registerPlugin()` called in 10 separate section files. Should be called once.
**Fix:** Keep registration only in `src/hooks/useScrollAnimation.ts`. Remove direct GSAP imports from individual section components; use the hook instead.

**Files:** `src/hooks/useScrollAnimation.ts`, 9× section components

---

## Critical Files Reference

| File | Groups |
|---|---|
| `index.html` | 1a, 4a |
| `src/index.css` | 1a |
| `src/components/ResponsiveImage.tsx` | 1b, 1c |
| `src/components/sections/Hero.tsx` | 1b |
| `src/components/PropertyGallery.tsx` | 1c |
| `src/App.tsx` | 2a |
| `vite.config.ts` | 2b |
| `src/pages/Properties.tsx` | 3a |
| `src/components/sections/AboutUs.tsx` | 3b |
| `src/components/sections/ContactSection.tsx` | 3b |
| `src/components/sections/PublishCTA.tsx` | 3b |
| `src/components/sections/Agents.tsx` | 3b |
| `src/pages/PropertyDetail.tsx` | 3b |
| `src/hooks/useScrollAnimation.ts` | 4b |

---

## Verification (after each group)

1. `npm run build` — confirm no TypeScript/build errors
2. `npm run preview` — serve production build locally
3. Lighthouse (mobile, throttled 4G) in Chrome DevTools → check FCP, LCP, TBT
4. Network panel: confirm fonts load in parallel, route chunks are separate files, LCP image has `fetchpriority="high"` in HTML source