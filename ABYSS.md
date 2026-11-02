# ABYSS — Allen John Joy's portfolio rebuild (project brief for the coding agent)

Read this whole file before touching code. Work ONE PHASE AT A TIME. After each phase: run `pnpm lint` and `pnpm build`, run `pnpm dev`, open the site in the browser, check it visually, then stop and report what changed and what you verified. Do not start the next phase until I say so.

## 1. Existing project (analysed, do not break)
- Next.js 16.1.1 App Router, React 19, TypeScript, Tailwind v4 (`@import "tailwindcss"` in `src/app/globals.css`), shadcn/ui (new-york, neutral), next-themes (default dark), `lenis` and `motion` already installed. Package manager: **pnpm** (use only pnpm; never create or edit package-lock.json by hand).
- Single content source: `src/data/resume.tsx` (`DATA`): name "Allen John Joy", role "MCA student and Web Developer", summary, 9 skills (React, Node, TypeScript, Python, JavaScript, Angular, Flask, MySQL, SQLite, with SVGs in `public/skill-icons`), 2 education entries (FISAT MCA 2025–Present, Sahrdaya BCA 2022–2025), 6 projects (DocShare, Wrapped Revanced, CineView Hub, PDF Tools, QuickBench, QuickQR Tools) with screenshots in `public/projects/*.png`, social links, CV at `public/Allen-John-Joy-CV.pdf`, avatar `public/profile.jpg`. **Keep `DATA` as the single source of truth. Never hardcode project or profile text in new components.**
- Current layout (`src/app/layout.tsx`) wraps everything in a `max-w-2xl` column with Navbar (dock), ScrollProgress, FlickeringGrid, PageTransition, SmoothScrollProvider (Lenis, exposed as `window.__lenis`), Vercel Analytics + SpeedInsights + GoogleAnalytics, JSON-LD in `page.tsx`, metadata, sitemap, robots, opengraph-image. **Keep all SEO, analytics and metadata.**
- Strict CSP in `next.config.mjs` (`default-src 'self'`, no `worker-src`, `img-src 'self' data: blob:`). All 3D assets must be self-hosted in `/public`. If you add anything needing blob workers or other origins, update the CSP minimally and tell me.
- Fonts: `public/fonts/ClashDisplay-Semibold.ttf` and `CabinetGrotesk-Medium.ttf` exist. Use Clash Display for display headings via `next/font/local`, and Geist Mono for gauge and labels. Body font: Cabinet Grotesk.

## 2. The concept
**ABYSS**: scrolling is a dive in a submersible from the sunlit surface to the seabed. Each part of the portfolio lives in a depth zone, and the deeper you go the darker it gets. **The cursor (finger on touch) is the submersible's lamp.** Content in dark water is only revealed where the lamp shines, so visitors explore my work instead of reading a list.

Depth map (scroll progress 0 to 1, ~3800 m total):
| Zone | Depth | Content |
|---|---|---|
| Surface / Sunlight | 0–200 m | Hero (name, role, CV and GitHub buttons), About |
| Sunlight | 200–600 m | Skills as a glowing shoal of orbs using the real skill SVGs |
| Twilight | 600–1500 m | Education as two "sonar pings", then Projects 1–2 |
| Midnight | 1500–3000 m | Projects 3–4 |
| Abyss | 3000–3600 m | Projects 5–6 |
| Seabed | 3600–3800 m | Contact (email, GitHub, LinkedIn), CV download |

Projects are "specimens": each screenshot is a textured plane in the water, lit only by the lamp, with a subtle refraction ripple and a hover and tap state that shows title, description, tech tags and live/GitHub links.

Visual language: deep teal to near-black gradient, cyan (#5ff2e0) accent, bioluminescent blue/cyan glows, mono-spaced HUD (depth in m, temperature, pressure, zone name) as a fixed gauge. Serious and cinematic, not cartoonish. No emoji in the UI.

## 3. Reference prototype
`reference/abyss-reference.html` is a working single-file prototype (vanilla Three.js). Port its fragment shader (caustics, god rays, fbm fog, 3-layer marine snow, bioluminescence, lamp mask) and its depth/lamp logic into the real architecture. Improve it, do not copy it blindly.

## 4. Tech and architecture rules
- Add: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap` (ScrollTrigger plugin; the current GSAP package includes all plugins), `@types/three`. Use the newest versions that are compatible with React 19 and Next 16; verify peer dependencies before installing.
- Reuse the existing Lenis. Sync it with GSAP ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`). Remove the duplicate `autoRaf` if you take over the RAF loop.
- ONE fixed full-screen R3F `<Canvas>` behind the content, loaded with `next/dynamic` and `ssr: false`. All text, links and headings stay in the **DOM** (server-rendered, selectable, indexable, accessible), laid over the canvas. The canvas is enhancement only.
- Shared scroll and lamp state lives in a small module store (zustand-free is fine; a plain mutable object read inside `useFrame`) so scrolling never triggers React re-renders.
- Shaders live in `src/components/abyss/shaders/*.ts` as exported template strings (no `.glsl` loaders needed).
- Folder: `src/components/abyss/` (Scene, Ocean, Specimens, Shoal, Creatures, Hud, Lamp, store.ts, zones.ts).
- Strict TypeScript, no `any`. Components under 200 lines. Dispose geometries, materials and textures on unmount. Respect `prefers-reduced-motion`.
- Work on a git branch named `abyss`. Do not delete the old components until the new page is complete; move unused ones into a `legacy` note in your report instead.

## 5. Quality bar
60 fps on a mid laptop, 30+ fps on a mid phone. Cap DPR (1.5 desktop, 1.25 mobile) and use drei `PerformanceMonitor` to downscale. Pause rendering when the tab is hidden or the canvas is off-screen. Text over dark water must stay readable: minimum 12% visibility even outside the lamp, and fully visible when focused with the keyboard.
Fallback: if WebGL fails, the device is low-power, or reduced motion is on, show a static CSS gradient version with the same DOM content.

---

# PHASES (do them in order, one per request)

## Phase 1: Foundation
1. Create branch `abyss`. Copy the prototype to `reference/abyss-reference.html`.
2. `pnpm add` the dependencies above.
3. Refactor `layout.tsx`: remove the `max-w-2xl` wrapper, FlickeringGrid, PageTransition and ScrollProgress. Keep fonts, metadata, ThemeProvider (force dark), Analytics, SpeedInsights, GoogleAnalytics, JSON-LD. Add the local fonts.
4. Create `src/components/abyss/` with `store.ts` (depth 0..1 smoothed, velocity, lamp x/y), `zones.ts` (the depth map above as typed data), and `Scene.tsx` (a fixed full-screen Canvas, dynamically imported, rendering a plain dark teal clear color for now).
5. Rewrite `SmoothScrollProvider` to own Lenis + ScrollTrigger sync and publish depth/velocity to the store. Keep `window.__lenis`.
6. Replace `page.tsx` body with a stack of empty full-height sections (ids: hero, about, skills, education, projects, contact), still showing the existing content as plain text so nothing is lost.
Done when: build passes, page scrolls smoothly, the store logs correct depth 0 to 1, no hydration warnings.

## Phase 2: The ocean
Port the shader into `Ocean.tsx` as a full-screen quad driven by `uDepth`, `uTime`, `uLamp`, `uRes`, `uVel`. Add the lamp: smoothed pointer position, soft cone with slight flicker, stronger at depth. Add scroll-velocity streaks in marine snow. Build `Hud.tsx`: fixed gauge with depth in m, temperature, zone name that crossfades on change, and a thin vertical depth ruler with project markers.
Done when: a smooth surface to abyss transition and the lamp works on mouse and touch.

## Phase 3: Content as depth zones
Build the DOM sections per the depth map, reading everything from `DATA`.
- Hero: big Clash Display name with GSAP letter reveal, role line, CV button (reuse `CvDownloadButton`) and GitHub button, hint "Your cursor is your lamp".
- About: summary text.
- Skills: the real SVGs as drifting orbs (CSS/GSAP in the DOM for now) that glow brighter near the lamp.
- Education: two sonar-ping entries with school, degree, years, links.
- Contact: seabed with email, GitHub, LinkedIn.
Implement lamp-proximity visibility for text blocks (min 12% opacity, driven by distance to lamp and ambient light of the current depth) using one rAF loop that writes CSS variables, not React state.
Done when: all original content is reachable and readable, and exploring with the lamp feels good.

## Phase 4: Project specimens (the showpiece)
First convert the three ~1.2 MB PNGs (spotify, speedtest, qrtools) and the rest to resized WebP (max 1600px wide) under `public/projects/`, update `DATA` paths, keep the originals out of the bundle.
Then build `Specimens.tsx`: 6 textured planes positioned along the dive, alternating left and right, slightly rotated, each with a custom shader: lamp-lit only, caustic overlay, gentle refraction ripple that increases on hover, a faint cyan rim glow. DOM overlay card (title, description, tags, live/GitHub links using `DATA.projects[i].links`) fades in when a specimen is lit or focused. Entire specimen is clickable. Keyboard accessible (each project is a real link in the DOM; the plane is decorative).
Done when: all 6 projects look great, load lazily, and links work.

## Phase 5: Life in the water
Add (instanced where possible): a school of small fish that flee the lamp, 2 to 3 translucent jellyfish with fresnel shading and slow pulse in the twilight/midnight zones, a deep-sea anglerfish-style glow orb in the abyss, bubble trails when scroll velocity is high, and a subtle submersible silhouette or lamp housing at screen edge. Optional: a sound toggle (off by default) with ambient underwater loops that deepen with depth, self-hosted, never autoplay.
Done when: it feels alive without hurting frame rate.

## Phase 6: Navigation, intro and polish
Replace the dock navbar with a "depth sounder": a fixed side or bottom control with zone markers that smooth-scroll via Lenis. Add an intro "Descending…" loader that preloads textures, then a hero reveal. Page transitions, hover states, focus rings, a custom cursor ring that matches the lamp on desktop, and a nice 404.

## Phase 7: Performance, accessibility, fallback, ship
Reduced motion mode, no-WebGL fallback, low-power detection, PerformanceMonitor tuning, pause when hidden, keyboard-only walkthrough, contrast check, `next/image` for any DOM images, Lighthouse run (target 90+ performance on desktop), final `pnpm lint` and `pnpm build`, preview deployment notes for Vercel. Update README with the concept, structure and how to tweak depth zones.
