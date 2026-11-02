"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { DATA } from "@/data/resume";
import { abyssStore } from "./store";
import {
  specimenFragmentShader,
  specimenVertexShader,
} from "./shaders/specimenShader";

// Subtle alternating tilt rotations in radians (~2 degrees)
const SPECIMEN_ROTATIONS = [-0.035, 0.035, -0.03, 0.035, -0.025, 0.03] as const;

interface SpecimenItemProps {
  index: number;
  project: (typeof DATA.projects)[number];
}

/**
 * Single 3D Specimen textured plane synced to its DOM #specimen-frame-${index}.
 */
function SpecimenItem({ index, project }: SpecimenItemProps) {
  const { size, viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverRef = useRef<number>(0);

  // 1x1 fallback dark texture
  const fallbackTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#02131d";
      ctx.fillRect(0, 0, 1, 1);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: specimenVertexShader,
      fragmentShader: specimenFragmentShader,
      uniforms: {
        uTexture: { value: fallbackTexture },
        uTime: { value: 0 },
        uDepth: { value: 0 },
        uLamp: { value: new THREE.Vector2(0.5, 0.5) },
        uHover: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
  }, [fallbackTexture]);

  // Lazy texture loader with mipmapping and clean disposal
  useEffect(() => {
    if (!project.image) return;

    let loadedTexture: THREE.Texture | null = null;
    const loader = new THREE.TextureLoader();

    loader.load(
      project.image,
      (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.needsUpdate = true;
        loadedTexture = tex;

        material.uniforms.uTexture.value = tex;
      },
      undefined,
      (err) => {
        console.warn(`Failed to load specimen texture for ${project.title}:`, err);
      }
    );

    return () => {
      loadedTexture?.dispose();
      fallbackTexture.dispose();
      material.dispose();
    };
  }, [project.image, project.title, material, fallbackTexture]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const frameEl = document.getElementById(`specimen-frame-${index}`);
    if (!frameEl) {
      mesh.visible = false;
      return;
    }

    const rect = frameEl.getBoundingClientRect();

    // Frustum culling: hide if outside active viewport
    if (rect.bottom < -120 || rect.top > size.height + 120) {
      mesh.visible = false;
      return;
    }

    mesh.visible = true;

    // Convert DOM rect center into Three.js world space
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const ndcX = (cx / size.width) * 2 - 1;
    const ndcY = -((cy / size.height) * 2 - 1);

    mesh.position.x = (ndcX * viewport.width) * 0.5;
    mesh.position.y = (ndcY * viewport.height) * 0.5;
    mesh.position.z = 0.05;

    mesh.scale.x = (rect.width / size.width) * viewport.width;
    mesh.scale.y = (rect.height / size.height) * viewport.height;
    mesh.rotation.z = SPECIMEN_ROTATIONS[index % SPECIMEN_ROTATIONS.length];

    // Lamp pointer hover detection
    const pointerPixelX = abyssStore.lampX * size.width;
    const pointerPixelY = (1.0 - abyssStore.lampY) * size.height;

    const isHovered =
      pointerPixelX >= rect.left &&
      pointerPixelX <= rect.right &&
      pointerPixelY >= rect.top &&
      pointerPixelY <= rect.bottom;

    const targetHover = isHovered ? 1.0 : 0.0;
    hoverRef.current += (targetHover - hoverRef.current) * 0.12;

    // Update uniform values via mesh material
    const mat = mesh.material as THREE.ShaderMaterial;
    if (mat && mat.uniforms) {
      mat.uniforms.uTime.value = state.clock.getElapsedTime();
      mat.uniforms.uDepth.value = abyssStore.depth;
      mat.uniforms.uLamp.value.set(abyssStore.lampX, abyssStore.lampY);
      mat.uniforms.uHover.value = hoverRef.current;
    }
  });

  return (
    <mesh ref={meshRef} material={material} frustumCulled={false}>
      <planeGeometry args={[1, 1, 16, 16]} />
    </mesh>
  );
}

/**
 * Project Specimens container component rendering all 6 specimen items.
 */
export default function Specimens() {
  return (
    <group renderOrder={1}>
      {DATA.projects.map((proj, i) => (
        <SpecimenItem key={proj.title} index={i} project={proj} />
      ))}
    </group>
  );
}
