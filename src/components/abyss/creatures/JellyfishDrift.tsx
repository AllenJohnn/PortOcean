"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { abyssStore } from "../store";
import {
  jellyfishFragmentShader,
  jellyfishVertexShader,
} from "../shaders/jellyfishShader";

interface JellyConfig {
  x: number;
  y: number;
  z: number;
  scale: number;
  speed: number;
  pulseOffset: number;
  color: THREE.Color;
}

const JELLY_CONFIGS: readonly JellyConfig[] = [
  {
    x: -1.6,
    y: 0.4,
    z: -0.1,
    scale: 0.48,
    speed: 0.25,
    pulseOffset: 0.0,
    color: new THREE.Color("#4fe3d3"),
  },
  {
    x: 1.8,
    y: -0.6,
    z: -0.3,
    scale: 0.62,
    speed: 0.18,
    pulseOffset: 1.8,
    color: new THREE.Color("#68b8ff"),
  },
  {
    x: -0.4,
    y: -1.2,
    z: -0.2,
    scale: 0.42,
    speed: 0.22,
    pulseOffset: 3.5,
    color: new THREE.Color("#50f4c8"),
  },
];

/**
 * Translucent bioluminescent jellyfish drifting in Twilight and Midnight zones (600–2600 m).
 * Renders 3 jellyfish with pulsating bell contraction and Fresnel translucency.
 */
export default function JellyfishDrift() {
  const groupRef = useRef<THREE.Group>(null);
  const tentacleMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Bell geometry: hemisphere dome
  const bellGeometry = useMemo(() => {
    return new THREE.SphereGeometry(0.5, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  }, []);

  // Tentacles geometry: multiple slender wavy ribbon lines
  const tentacleGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.006, 0.002, 1.4, 6, 16);
    geom.translate(0, -0.7, 0);
    return geom;
  }, []);

  const materials = useMemo(() => {
    return JELLY_CONFIGS.map((cfg) => {
      return new THREE.ShaderMaterial({
        vertexShader: jellyfishVertexShader,
        fragmentShader: jellyfishFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uDepth: { value: 0 },
          uPulseOffset: { value: cfg.pulseOffset },
          uColor: { value: cfg.color },
          uZoneVisibility: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    const mats = materials;
    const bellGeom = bellGeometry;
    const tentGeom = tentacleGeometry;
    const tentMat = tentacleMatRef.current;

    return () => {
      bellGeom.dispose();
      tentGeom.dispose();
      tentMat?.dispose();
      mats.forEach((m) => m.dispose());
    };
  }, [materials, bellGeometry, tentacleGeometry]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const depth = abyssStore.depth;

    // Jellyfish appear in Twilight and Midnight zones (approx depth 0.18 to 0.72)
    const fadeIn = THREE.MathUtils.smoothstep(depth, 0.14, 0.26);
    const fadeOut = 1.0 - THREE.MathUtils.smoothstep(depth, 0.65, 0.78);
    const visibility = fadeIn * fadeOut;

    if (visibility <= 0.001) {
      group.visible = false;
      return;
    }

    group.visible = true;
    const time = state.clock.getElapsedTime();

    // Update jellyfish position drifts and shader uniforms
    materials.forEach((mat, i) => {
      const cfg = JELLY_CONFIGS[i];
      const child = group.children[i];

      if (child) {
        // Slow vertical and horizontal oceanic bobbing
        const driftY = cfg.y + Math.sin(time * cfg.speed + cfg.pulseOffset) * 0.28;
        const driftX = cfg.x + Math.cos(time * cfg.speed * 0.6 + cfg.pulseOffset) * 0.18;
        child.position.y = driftY;
        child.position.x = driftX;
      }

      mat.uniforms.uTime.value = time;
      mat.uniforms.uDepth.value = depth;
      mat.uniforms.uZoneVisibility.value = visibility;
    });

    if (tentacleMatRef.current) {
      tentacleMatRef.current.opacity = visibility * 0.35;
    }
  });

  return (
    <group ref={groupRef}>
      {JELLY_CONFIGS.map((cfg, i) => (
        <group key={i} position={[cfg.x, cfg.y, cfg.z]} scale={cfg.scale}>
          {/* Pulsating translucent bell */}
          <mesh geometry={bellGeometry} material={materials[i]} />

          {/* Trailing tentacles */}
          {[-0.18, -0.06, 0.06, 0.18].map((ox, ti) => (
            <mesh
              key={ti}
              position={[ox, -0.02, (ti % 2 === 0 ? 0.08 : -0.08)]}
              geometry={tentacleGeometry}
            >
              <meshBasicMaterial
                ref={tentacleMatRef}
                color="#5ff2e0"
                transparent
                opacity={0.25}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
