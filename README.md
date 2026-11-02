# PortOcean (ABYSS)

> **Allen John Joy's Portfolio Rebuild** — An interactive 3D deep-sea submersible dive from the sunlit surface to the ocean seabed (~3,800 m).

## Overview
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`), Shadcn UI, dark theme
- **3D & Shaders:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animation & Scrolling:** Lenis smooth scrolling synced with GSAP `ScrollTrigger`
- **Typography:** Clash Display (headings), Cabinet Grotesk (body), Geist Mono (HUD & coordinates)
- **Package Manager:** `pnpm`

## Getting Started

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start development server:**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production build:**
   ```bash
   pnpm build
   pnpm start
   ```

## Architecture
- All content is driven by a single source of truth in `src/data/resume.tsx`.
- The R3F Canvas sits in the background (`src/components/abyss/Scene.tsx`), dynamically imported with `ssr: false`.
- Scroll and lamp pointer state are tracked in a mutable store (`src/components/abyss/store.ts`) inside the RAF loop to prevent React re-renders.
- All DOM text, headings, and links remain accessible and SEO-friendly.
