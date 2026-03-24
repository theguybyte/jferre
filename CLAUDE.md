# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server at localhost:5173 (HMR enabled)
npm run build     # TypeScript check + Vite production build → /dist
npm run preview   # Serve /dist locally
npm run lint      # ESLint across entire project
```

There are no tests in this project.

## Architecture

Single-page React 19 + TypeScript app (Vite) for J. Ferré Joyería — a premium jewelry portfolio/e-commerce showcase. No backend; all data is client-side only.

### Content is config-driven

**`src/config.ts`** is the single source of truth for all page content (text, images, links, products). Every section component reads from a typed config object exported from this file. Sections conditionally render based on whether config values are present — missing or empty config hides the section.

### State lives in App.tsx

`src/App.tsx` owns all cart state (`cartItems`, `isCartOpen`, `addToCart`, `updateQuantity`, `removeItem`) and passes handlers down as props. There is no global state manager — just React `useState`.

### Page sections flow top to bottom

```
App.tsx → Hero → FeaturedProducts → TrustBadges → IntroGrid → Services
        → WhyChooseMe → FeaturedProjects → Testimonials → FAQ → Footer
        → CartDrawer (overlay)
```

Each section is a file in `src/sections/`. Components in `src/components/ui/` are Shadcn/ui-style wrappers around Radix UI primitives.

### Animation system

- **GSAP + ScrollTrigger**: scroll-driven entrance animations in each section. Always clean up with `gsap.context()` / `.revert()` in `useEffect` return.
- **Lenis** (`src/hooks/useLenis.ts`): smooth scroll connected to GSAP's ticker so they stay in sync.

### Icon system

Services and Footer use a string-based icon name (e.g. `"Diamond"`, `"Camera"`) that is mapped to a Lucide React component inside the respective section file. Add new icons to the map in the component, not in config.

### Path alias

`@/` resolves to `src/` — configured in both `vite.config.ts` and `tsconfig.app.json`.

## Design tokens

- **Accent/gold**: `#D4AF37` (`--soft-gold`, Tailwind `primary`)
- **Background**: `#F7F3EF` (warm ivory)
- **Dark backgrounds**: `#0d1310`, `#1a2420`, `#2a3a34` (forest theme)
- **Heading font**: Cormorant Garamond (serif)
- **Body font**: Montserrat (sans)

Custom CSS ease functions (`--ease-royal`, `--ease-silk`, etc.) and button classes (`.btn-primary`, `.btn-gold`, `.btn-outline-gold`) are defined in `src/index.css`.

## Key constraints

- Cart is client-side only — no persistence, no backend.
- The build target is static hosting (`base: "./"` in `vite.config.ts`).
- Dark mode classes exist (Tailwind `darkMode: "class"`) but are not actively toggled in the UI.
