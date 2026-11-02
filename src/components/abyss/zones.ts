/**
 * Depth zone definitions and helpers for ABYSS dive simulation.
 * Dive depth spans 0 to 3,800 meters across 6 distinct ocean layers.
 */

export interface DepthZone {
  readonly id: string;
  readonly name: string;
  readonly depthStartM: number;
  readonly depthEndM: number;
  readonly progressStart: number;
  readonly progressEnd: number;
  readonly contentDescription: string;
  readonly tempRangeC: readonly [number, number];
}

export const TOTAL_DEPTH_METERS = 3800;

export const DEPTH_ZONES: readonly DepthZone[] = [
  {
    id: "surface",
    name: "Surface / Sunlight",
    depthStartM: 0,
    depthEndM: 200,
    progressStart: 0,
    progressEnd: 200 / TOTAL_DEPTH_METERS,
    contentDescription: "Hero (name, role, CV, GitHub) & About",
    tempRangeC: [24.0, 20.0],
  },
  {
    id: "sunlight",
    name: "Sunlight Zone",
    depthStartM: 200,
    depthEndM: 600,
    progressStart: 200 / TOTAL_DEPTH_METERS,
    progressEnd: 600 / TOTAL_DEPTH_METERS,
    contentDescription: "Skills glowing shoal of orbs",
    tempRangeC: [20.0, 15.0],
  },
  {
    id: "twilight",
    name: "Twilight Zone",
    depthStartM: 600,
    depthEndM: 1500,
    progressStart: 600 / TOTAL_DEPTH_METERS,
    progressEnd: 1500 / TOTAL_DEPTH_METERS,
    contentDescription: "Education sonar pings & Projects 1–2",
    tempRangeC: [15.0, 7.0],
  },
  {
    id: "midnight",
    name: "Midnight Zone",
    depthStartM: 1500,
    depthEndM: 3000,
    progressStart: 1500 / TOTAL_DEPTH_METERS,
    progressEnd: 3000 / TOTAL_DEPTH_METERS,
    contentDescription: "Projects 3–4",
    tempRangeC: [7.0, 4.0],
  },
  {
    id: "abyss",
    name: "Abyssal Zone",
    depthStartM: 3000,
    depthEndM: 3600,
    progressStart: 3000 / TOTAL_DEPTH_METERS,
    progressEnd: 3600 / TOTAL_DEPTH_METERS,
    contentDescription: "Projects 5–6",
    tempRangeC: [4.0, 2.5],
  },
  {
    id: "seabed",
    name: "Seabed",
    depthStartM: 3600,
    depthEndM: 3800,
    progressStart: 3600 / TOTAL_DEPTH_METERS,
    progressEnd: 1.0,
    contentDescription: "Contact & CV download",
    tempRangeC: [2.5, 2.0],
  },
] as const;

/**
 * Get active depth zone for a normalized scroll progress (0..1).
 */
export function getZoneByProgress(progress: number): DepthZone {
  const clamped = Math.max(0, Math.min(1, progress));
  for (const zone of DEPTH_ZONES) {
    if (clamped <= zone.progressEnd) {
      return zone;
    }
  }
  return DEPTH_ZONES[DEPTH_ZONES.length - 1];
}

/**
 * Convert 0..1 scroll progress to dive depth in meters (0..3800).
 */
export function progressToMeters(progress: number): number {
  return Math.round(Math.max(0, Math.min(1, progress)) * TOTAL_DEPTH_METERS);
}

/**
 * Calculate water temperature in °C based on depth.
 */
export function progressToTemperature(progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  return Number((24 - 22 * Math.min(1, clamped * 1.5)).toFixed(1));
}
