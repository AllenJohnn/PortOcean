"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { abyssStore } from "./store";
import { oceanFragmentShader, oceanVertexShader } from "./shaders/oceanShader";

/**
 * Full-screen R3F Ocean quad driven by real-time abyss store values.
 * Renders depth absorption, animated caustics, god rays, marine snow parallax,
 * bioluminescence, and pointer-following submersible lamp.
 */
export default function Ocean() {
  const { size } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uDepth: { value: 0 },
      uVel: { value: 0 },
      uLamp: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
      uFlicker: { value: 1.0 },
    };
  }, [size.width, size.height]);

  // Keep screen resolution uniform updated on resize
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uRes.value.set(size.width, size.height);
    }
  }, [size.width, size.height]);

  // Clean disposal on unmount
  useEffect(() => {
    const mat = materialRef.current;
    const geom = geometryRef.current;
    return () => {
      mat?.dispose();
      geom?.dispose();
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.getElapsedTime();
    const u = materialRef.current.uniforms;

    u.uTime.value = time;
    u.uDepth.value = abyssStore.depth;
    u.uVel.value = abyssStore.velocity;
    u.uLamp.value.set(abyssStore.lampX, abyssStore.lampY);

    // Organic lamp flicker (~0.96 to 1.04) with high-frequency harmonic flutter
    const flicker =
      1.0 +
      0.035 * Math.sin(time * 17.5) * Math.cos(time * 31.2) +
      0.015 * Math.sin(time * 73.1);
    u.uFlicker.value = flicker;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry ref={geometryRef} args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={oceanVertexShader}
        fragmentShader={oceanFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
