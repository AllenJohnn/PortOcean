"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { abyssStore } from "../store";

const BUBBLE_COUNT = 32;

interface BubbleData {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  wobblePhase: number;
}

// Deterministic pseudorandom generator outside component (pure and SSR-safe)
function generateDeterministicBubbles(): BubbleData[] {
  const list: BubbleData[] = [];
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const s1 = Math.sin(i * 19.123) * 43758.5453;
    const r1 = s1 - Math.floor(s1);
    const s2 = Math.sin(i * 43.456) * 43758.5453;
    const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 87.789) * 43758.5453;
    const r3 = s3 - Math.floor(s3);

    list.push({
      x: (r1 - 0.5) * 5.0,
      y: (r2 - 0.5) * 4.0,
      z: -0.1 - r3 * 0.4,
      size: 0.02 + r2 * 0.04,
      speed: 1.2 + r3 * 1.5,
      wobblePhase: r1 * Math.PI * 2,
    });
  }
  return list;
}

const STATIC_BUBBLES = generateDeterministicBubbles();

/**
 * High-velocity Bubble Trails emitted when the submersible dives rapidly.
 * Renders instanced floating bubbles that stream upward and stretch with scroll velocity.
 */
export default function BubbleTrails() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  // Mutable simulation state stored in ref
  const bubblesRef = useRef<BubbleData[]>(STATIC_BUBBLES);

  // Bubble disc geometry
  const geometry = useMemo(() => new THREE.CircleGeometry(1, 16), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Bubble texture with bright rim and specular highlight
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Outer rim
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = "rgba(95, 242, 224, 0.85)";
      ctx.stroke();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(24, 24, 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Cleanup
  useEffect(() => {
    const geom = geometry;
    const tex = texture;
    const mat = materialRef.current;
    return () => {
      geom.dispose();
      tex.dispose();
      mat?.dispose();
    };
  }, [geometry, texture]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const vel = abyssStore.velocity;
    const speedFactor = Math.min(1.0, Math.abs(vel) * 25.0);

    // Only render when scroll velocity is active
    if (speedFactor < 0.02) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;

    if (materialRef.current) {
      materialRef.current.opacity = speedFactor * 0.75;
    }

    const t = state.clock.getElapsedTime();
    const list = bubblesRef.current;

    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const b = list[i];

      // Stream upward rapidly with scroll velocity
      b.y += 0.03 * b.speed * (1.0 + speedFactor * 3.0);
      if (b.y > 2.5) {
        b.y = -2.5;
        b.x = ((i * 0.31) % 5.0) - 2.5;
      }

      const wobbleX = b.x + Math.sin(t * 5.0 + b.wobblePhase) * 0.04;
      dummy.position.set(wobbleX, b.y, b.z);

      // Vertical elongation proportional to velocity
      const stretchY = b.size * (1.0 + speedFactor * 0.6);
      dummy.scale.set(b.size, stretchY, 1);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, BUBBLE_COUNT]}
      frustumCulled={false}
    >
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
