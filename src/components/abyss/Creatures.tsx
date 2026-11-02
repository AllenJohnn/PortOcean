"use client";

import FishSchool from "./creatures/FishSchool";
import JellyfishDrift from "./creatures/JellyfishDrift";
import AnglerGlow from "./creatures/AnglerGlow";
import BubbleTrails from "./creatures/BubbleTrails";

/**
 * Unifying container for all Phase 5 aquatic life and submersible physics:
 * - Instanced school of small fish fleeing the lamp in Sunlight/Twilight zones.
 * - 3 Translucent jellyfish with Fresnel shading in Twilight/Midnight zones.
 * - Deep-sea anglerfish bioluminescent lure and silhouette in the Abyss.
 * - High-velocity bubble trails streaming on scroll.
 */
export default function Creatures() {
  return (
    <group renderOrder={2}>
      <FishSchool />
      <JellyfishDrift />
      <AnglerGlow />
      <BubbleTrails />
    </group>
  );
}
