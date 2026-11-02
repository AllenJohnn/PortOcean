/**
 * Shared scroll, depth, and lamp state for ABYSS.
 * Plain mutable store read inside useFrame/RAF to avoid React re-renders.
 */
export interface AbyssStore {
  /** Target scroll progress (0..1) directly from scroll listeners */
  targetDepth: number;
  /** Smoothed depth progress (0..1) interpolated via lerp */
  depth: number;
  /** Current scroll velocity from Lenis */
  velocity: number;

  /** Pointer target coordinates normalized (0..1) */
  lampTargetX: number;
  lampTargetY: number;
  /** Smoothed lamp coordinates normalized (0..1) */
  lampX: number;
  lampY: number;

  /** Screen dimensions and DPR */
  width: number;
  height: number;
  dpr: number;

  /** Active zone index */
  zoneIndex: number;
}

export const abyssStore: AbyssStore = {
  targetDepth: 0,
  depth: 0,
  velocity: 0,
  lampTargetX: 0.5,
  lampTargetY: 0.5,
  lampX: 0.5,
  lampY: 0.5,
  width: typeof window !== "undefined" ? window.innerWidth : 1920,
  height: typeof window !== "undefined" ? window.innerHeight : 1080,
  dpr: typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 1.5) : 1,
  zoneIndex: 0,
};
