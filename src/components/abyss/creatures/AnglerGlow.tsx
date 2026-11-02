"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { abyssStore } from "../store";

/**
 * Deep-sea anglerfish-style bioluminescent lure and silhouette in the Abyss zone (3000–3600 m).
 * Features an organic pulsing esca lure that casts a glowing halo in pitch-black water.
 */
export default function AnglerGlow() {
  const groupRef = useRef<THREE.Group>(null);
  const lureMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const haloMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const bodyMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const filamentMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Lure sphere geometry
  const lureGeometry = useMemo(() => new THREE.SphereGeometry(0.045, 16, 16), []);

  // Lure halo disc geometry
  const haloGeometry = useMemo(() => new THREE.PlaneGeometry(0.7, 0.7), []);

  // Angler body silhouette: elongated tapered wedge
  const bodyGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.35, 0.9, 16);
    geom.rotateZ(Math.PI * 0.45);
    return geom;
  }, []);

  // Curved lure antenna (filament)
  const filamentGeometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 0.1, 0),
      new THREE.Vector3(0.1, 0.35, 0),
      new THREE.Vector3(-0.15, 0.4, 0),
      new THREE.Vector3(-0.35, 0.25, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.008, 6, false);
  }, []);

  // Radial soft glow texture for halo
  const haloTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(95, 242, 224, 0.9)");
      grad.addColorStop(0.3, "rgba(95, 242, 224, 0.3)");
      grad.addColorStop(0.7, "rgba(20, 110, 140, 0.08)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Clean disposal
  useEffect(() => {
    const lGeom = lureGeometry;
    const hGeom = haloGeometry;
    const bGeom = bodyGeometry;
    const fGeom = filamentGeometry;
    const hTex = haloTexture;

    return () => {
      lGeom.dispose();
      hGeom.dispose();
      bGeom.dispose();
      fGeom.dispose();
      hTex.dispose();
    };
  }, [lureGeometry, haloGeometry, bodyGeometry, filamentGeometry, haloTexture]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const depth = abyssStore.depth;

    // Anglerfish appears in the dark Abyss zone (~3000 to 3650 m, depth 0.76 to 0.96)
    const fadeIn = THREE.MathUtils.smoothstep(depth, 0.72, 0.82);
    const fadeOut = 1.0 - THREE.MathUtils.smoothstep(depth, 0.94, 0.99);
    const visibility = fadeIn * fadeOut;

    if (visibility <= 0.001) {
      group.visible = false;
      return;
    }
    group.visible = true;

    const t = state.clock.getElapsedTime();

    // Organic lure flicker and breathing pulse
    const pulse =
      0.75 +
      0.25 * Math.sin(t * 3.5) +
      0.08 * Math.sin(t * 14.2) * Math.cos(t * 7.1);

    if (lureMatRef.current) {
      lureMatRef.current.opacity = visibility * pulse;
    }
    if (haloMatRef.current) {
      haloMatRef.current.opacity = visibility * pulse * 0.7;
    }
    if (bodyMatRef.current) {
      bodyMatRef.current.opacity = visibility * 0.85;
    }
    if (filamentMatRef.current) {
      filamentMatRef.current.opacity = visibility * 0.75;
    }

    // Gentle hover motion
    group.position.y = -0.3 + Math.sin(t * 0.8) * 0.08;
    group.position.x = 1.4 + Math.cos(t * 0.6) * 0.06;
  });

  return (
    <group ref={groupRef} position={[1.4, -0.3, -0.15]}>
      {/* Dark menacing fish body silhouette */}
      <mesh
        position={[0.45, -0.05, -0.05]}
        geometry={bodyGeometry}
      >
        <meshBasicMaterial
          ref={bodyMatRef}
          color="#03151c"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      {/* Arched illicium filament */}
      <mesh geometry={filamentGeometry}>
        <meshBasicMaterial
          ref={filamentMatRef}
          color="#093846"
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </mesh>

      {/* Glowing esca (lure) */}
      <mesh
        position={[-0.35, 0.25, 0]}
        geometry={lureGeometry}
      >
        <meshBasicMaterial
          ref={lureMatRef}
          color="#5ff2e0"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Bioluminescent lure halo */}
      <mesh
        position={[-0.35, 0.25, 0.01]}
        geometry={haloGeometry}
      >
        <meshBasicMaterial
          ref={haloMatRef}
          map={haloTexture}
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
