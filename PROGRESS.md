# ABYSS Rebuild Progress Log

This document tracks the progress of the ABYSS portfolio rebuild across all phases.

---

## Phase 1: Foundation
- **Commit:** `c5566bc`
- **What Changed:**
  - Initialized git repository on branch `abyss` and linked remote `https://github.com/AllenJohnn/PortOcean.git`.
  - Installed core 3D and animation dependencies: `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `@types/three`.
  - Configured local fonts `ClashDisplay-Semibold` and `CabinetGrotesk-Medium` via `next/font/local` alongside Geist Mono in `src/app/layout.tsx`.
  - Established `src/components/abyss/`:
    - `store.ts`: Mutable depth, velocity, and lamp coordinates module for zero-React-render 60fps reads.
    - `zones.ts`: Typed depth map (0–3,800 m across Sunlight, Twilight, Midnight, Abyss, and Seabed).
    - `CanvasView.tsx` & `Scene.tsx`: Dynamically imported full-screen WebGL Canvas with capped DPR (1.5 desktop, 1.25 mobile).
  - Rewrote `SmoothScrollProvider.tsx` to synchronize Lenis with GSAP ScrollTrigger and drive the scroll ticker cleanly.
  - Replaced body in `src/app/page.tsx` with depth-zoned sections with IDs matching navigation anchors.
- **What Was Verified:**
  - Smooth 60fps scrolling with Lenis + ScrollTrigger sync.
  - Zero hydration errors or layout shift warnings.
  - Verified static generation and production compilation with `pnpm build`.
- **Known Issues:**
  - None.

---

## Phase 2: The Ocean
- **Commit:** `0bf8837`
- **What Changed:**
  - Authored custom GLSL ocean shader quad in `src/components/abyss/shaders/oceanShader.ts`:
    - Animated water caustics and god rays at the surface.
    - Color absorption curve from turquoise to deep navy to abyss near-black with dithering noise.
    - 3-layer parallax marine snow moving upward on scroll and stretching with scroll velocity.
    - Deep-sea bioluminescent patches only appearing in the midnight and abyss zones.
    - Submersible lamp cone with pointer tracking, lerp smoothing, subtle flicker, and depth-dependent boost.
  - Built `Ocean.tsx` as a full-screen shader quad reading `abyssStore` inside `useFrame`.
  - Enhanced touch drag and mouse pointer tracking in `SmoothScrollProvider.tsx`.
  - Created `Hud.tsx` providing real-time depth in meters, water temperature, pressure in bar, crossfading zone badges, and a vertical depth ruler with indicator pip.
- **What Was Verified:**
  - Verified in real browser at surface (0 m), mid-scroll (~1,900 m), and seabed (3,800 m).
  - Resolved GLSL inverted smoothstep edge issue to ensure saturated turquoise water rather than white blowout.
  - Interactive lamp illumination verified on mousemove and touch drag.
- **Known Issues:**
  - Bottom telemetry collided with dock on narrow mobile viewports (<640px). Addressed in Phase 3.

---

## Phase 3: Content as Depth Zones
- **Commit:** `627eb08`
- **What Changed:**
  - Sourced all content strictly from `DATA` in `src/data/resume.tsx` with zero hardcoded profile text.
  - Built `LampRevealController.tsx` using a single RAF loop mutating `--lamp-opacity: max(0.12, ambientLight(depth) + lampProximity)` on all `.lamp-reveal` elements.
  - Built `HeroName.tsx` with Clash Display font and GSAP letter-by-letter reveal (`yPercent: 70`, `ease: "expo.out"`).
  - Restyled buttons (`cv-download-button.tsx` and GitHub) with oceanic glass and cyan accents.
  - Created `SkillsShoal.tsx` rendering the 9 real SVGs from `DATA.skills` as glowing drifting orbs driven by GSAP orbital paths, brightening and repelling when the lamp approaches.
  - Created Sonar Pings for education entries with expanding radar ping ring animations.
  - Structured 6 alternating project specimens along the dive (`data-specimen={i}`, `id="specimen-${i}"`) with generous ~110vh spacing.
  - Created Seabed contact section at 3,800 m with email, GitHub, LinkedIn, and CV download.
  - Redesigned `Hud.tsx` responsive behavior: on mobile (<640px), telemetry is presented in a sleek top header so the bottom Dock navbar has 100% clear space with zero overlap.
  - Restyled Dock navbar in `navbar.tsx` with oceanic glass and cyan borders.
- **What Was Verified:**
  - Verified on desktop (1280x800) and mobile (390x844).
  - Confirmed GSAP letter reveals, floating skill orbs with full non-truncated titles, sonar ripples, and alternating specimen cards.
  - Verified mobile layout: zero collision between Dock navbar and HUD telemetry.
  - Passed `pnpm lint` and `pnpm build`.
- **Known Issues:**
  - Specimen cards showed text-only DOM representations until 3D textured planes were attached in Phase 4.

---

## Phase 4: Project Specimens (The Showpiece)
- **Commit:** Pending
- **What Changed:**
  - Converted all 6 project images in `public/projects/` from uncompressed PNGs (~4 MB total) to resized WebP (max 1600px wide, ~98 KB total, a 97.5% reduction in asset weight).
  - Updated `DATA.projects` image paths in `src/data/resume.tsx` to `.webp` and removed the legacy PNGs.
  - Authored `src/components/abyss/shaders/specimenShader.ts` with custom GLSL:
    - Lamp-lit only illumination (ambient light fades with depth; illuminated by pointer lamp cone).
    - Animated water caustic overlay across the screenshot surface.
    - Gentle refraction ripple that surges on hover.
    - Faint cyan (#5ff2e0) rim glow with hover amplification.
  - Built `src/components/abyss/Specimens.tsx` rendering 6 individual 3D textured planes synchronized in real time with `#specimen-frame-${i}` DOM bounding boxes.
  - Added subtle alternating tilt rotations (`SPECIMEN_ROTATIONS = [-0.035, 0.035, -0.03, 0.035, -0.025, 0.03]`).
  - Implemented lazy texture loading with mipmaps and complete disposal of materials, textures, and geometry on unmount.
  - Made each specimen fully clickable with an accessible link overlay while preserving individual outbound live/GitHub links.
- **What Was Verified:**
  - Verified on desktop: 3D planes align with DOM frames, caustics and refraction ripples surge on hover, and cyan rim glow is visible.
  - Verified in deep water (Midnight & Abyssal zones): specimens stay appropriately darker until the submersible lamp is cast over them.
  - Verified on mobile (390px): clean responsive scaling, no horizontal overflow.
  - Passed `pnpm lint` and `pnpm build` with zero errors.
- **Known Issues:**
  - None.
