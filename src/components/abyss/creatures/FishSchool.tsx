"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { abyssStore } from "../store";

const FISH_COUNT = 36;

interface FishData {
  baseX: number;
  baseY: number;
  baseZ: number;
  speed: number;
  phase: number;
  scale: number;
  fleeX: number;
  fleeY: number;
}

// Deterministic pseudorandom generator outside component (pure and SSR-safe)
function generateDeterministicFish(): FishData[] {
  const list: FishData[] = [];
  for (let i = 0; i < FISH_COUNT; i++) {
    const s1 = Math.sin(i * 12.9898) * 43758.5453;
    const r1 = s1 - Math.floor(s1);
    const s2 = Math.sin(i * 78.233) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 37.719) * 43758.5453;
    const r3 = s3 - Math.floor(s3);

    list.push({
      baseX: (r1 - 0.5) * 5.0,
      baseY: (r2 - 0.5) * 3.5,
      baseZ: -0.2 - r3 * 0.6,
      speed: 0.6 + r1 * 0.5,
      phase: i * 0.45,
      scale: 0.045 + r2 * 0.03,
      fleeX: 0,
      fleeY: 0,
    });
  }
  return list;
}

const STATIC_FISH = generateDeterministicFish();

/**
 * Instanced school of small bioluminescent fish in the Sunlight and Twilight zones (0–1200 m).
 * Fish swim gracefully in gentle sinusoidal paths and flee when the submersible lamp draws near.
 * Uses 1 single draw call for ultra-high 60fps performance.
 */
export default function FishSchool() {
  const { viewport } = useThree();
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Mutable simulation state stored in ref for React 19 compliance
  const fishList = useRef<FishData[]>(STATIC_FISH);

  // Fish geometry: low-poly tapered diamond silhouette with tail fin
  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Head
      0, 0, 0.4,
      // Left flank
      -0.08, 0, 0,
      // Right flank
      0.08, 0, 0,
      // Dorsal ridge
      0, 0.06, 0,
      // Ventral ridge
      0, -0.04, 0,
      // Tail tip
      0, 0, -0.4,
      // Tail fin top
      0, 0.12, -0.55,
      // Tail fin bottom
      0, -0.1, -0.55,
    ]);

    const indices = [
      0, 1, 3, 0, 3, 2, 0, 2, 4, 0, 4, 1,
      5, 3, 1, 5, 2, 3, 5, 4, 2, 5, 1, 4,
      5, 6, 7,
    ];

    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Cleanup
  useEffect(() => {
    const geom = geometry;
    const mat = materialRef.current;
    return () => {
      geom.dispose();
      mat?.dispose();
    };
  }, [geometry]);

  useFrame((state) => {
    const mesh = instancedMeshRef.current;
    if (!mesh) return;

    const depth = abyssStore.depth;

    // School is only visible in Sunlight and upper Twilight zones (depth < 0.35)
    const visibility = 1.0 - THREE.MathUtils.smoothstep(depth, 0.18, 0.35);
    if (visibility <= 0.001) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    if (materialRef.current) {
      materialRef.current.opacity = visibility * 0.85;
    }

    const t = state.clock.getElapsedTime();

    // Submersible lamp in Three.js world coordinates
    const lampWorldX = (abyssStore.lampX * 2.0 - 1.0) * (viewport.width * 0.5);
    const lampWorldY = ((1.0 - abyssStore.lampY) * 2.0 - 1.0) * (viewport.height * 0.5);

    const list = fishList.current;
    for (let i = 0; i < FISH_COUNT; i++) {
      const f = list[i];

      // Forward continuous swimming with schooling drift
      const swimX = f.baseX + Math.sin(t * f.speed * 0.7 + f.phase) * 1.4;
      const swimY = f.baseY + Math.cos(t * f.speed * 0.5 + f.phase) * 0.7;

      // Lamp avoidance (fleeing reaction)
      const dx = (swimX + f.fleeX) - lampWorldX;
      const dy = (swimY + f.fleeY) - lampWorldY;
      const dist = Math.hypot(dx, dy);

      let targetFleeX = 0;
      let targetFleeY = 0;

      // Lamp repulsion distance ~2.0 world units
      if (dist < 2.0) {
        const force = (1.0 - dist / 2.0) * 1.8;
        const angle = Math.atan2(dy, dx);
        targetFleeX = Math.cos(angle) * force;
        targetFleeY = Math.sin(angle) * force;
      }

      // Smooth lerp return to formation
      f.fleeX += (targetFleeX - f.fleeX) * 0.08;
      f.fleeY += (targetFleeY - f.fleeY) * 0.08;

      const posX = swimX + f.fleeX;
      const posY = swimY + f.fleeY;
      const posZ = f.baseZ;

      dummy.position.set(posX, posY, posZ);

      // Orient fish in movement heading + tail wag
      const heading = Math.atan2(
        Math.cos(t * f.speed * 0.7 + f.phase) * 0.7 + (targetFleeY - f.fleeY) * 0.5,
        Math.cos(t * f.speed * 0.7 + f.phase) * 1.4 + (targetFleeX - f.fleeX) * 0.5
      );
      const wag = Math.sin(t * 12.0 * f.speed + f.phase) * 0.15;

      dummy.rotation.set(0, 0, heading + wag);
      dummy.scale.set(f.scale, f.scale, f.scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedMeshRef}
      args={[geometry, undefined, FISH_COUNT]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        ref={materialRef}
        color="#5ff2e0"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
