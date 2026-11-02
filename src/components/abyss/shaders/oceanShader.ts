/**
 * Enhanced GLSL Shaders for the ABYSS Ocean background quad.
 *
 * Strict GLSL compliance:
 * - All smoothstep calls strictly use edge0 < edge1.
 * - Distance falloffs use 1.0 - smoothstep(0.0, radius, dist).
 * - Safe caustic length calculation preventing division by zero.
 * - Controlled additive lighting ensuring saturated turquoise at surface and pitch black abyss.
 */

export const oceanVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const oceanFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uDepth;
uniform float uVel;
uniform vec2 uLamp;
uniform vec2 uRes;
uniform float uFlicker;

// Pseudo-random hash
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

// 2D Value Noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

// Fractal Brownian Motion (4 octaves)
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = rot * p * 2.02 + vec2(27.4, 18.2);
    a *= 0.5;
  }
  return v;
}

// Bounded procedural animated water caustics (safe against division by zero)
float caustics(vec2 p, float t) {
  vec2 q = p * 2.8;
  vec2 i = q;
  float c = 0.0;
  for (int k = 0; k < 4; k++) {
    float fk = float(k + 1);
    float tt = t * (1.0 - 2.5 / fk);
    i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    float dx = max(0.005, abs(sin(i.x + tt)));
    float dy = max(0.005, abs(cos(i.y + tt)));
    vec2 denom = vec2(q.x / (dx * 120.0), q.y / (dy * 120.0));
    float dLen = max(0.002, length(denom));
    c += 1.0 / dLen;
  }
  c /= 4.0;
  c = 1.06 - pow(clamp(c, 0.0, 1.6), 1.25);
  return clamp(pow(max(0.0, c), 5.0), 0.0, 1.0);
}

void main() {
  vec2 aspect = vec2(uRes.x / max(1.0, uRes.y), 1.0);
  vec2 p = (vUv - 0.5) * aspect;
  vec2 lampPos = (uLamp - 0.5) * aspect;
  float d = clamp(uDepth, 0.0, 1.0);

  // 1. Water color depth absorption palette
  float localDepth = clamp(d + (1.0 - vUv.y) * 0.08, 0.0, 1.0);

  // Vibrant, rich oceanic colors
  vec3 colSurfaceTop  = vec3(0.035, 0.48, 0.58); // Sunlit Mediterranean turquoise
  vec3 colSurfaceMid  = vec3(0.015, 0.28, 0.42); // Tropical ocean blue
  vec3 colTwilight    = vec3(0.006, 0.09, 0.22); // Deep oceanic indigo
  vec3 colMidnight    = vec3(0.0018, 0.022, 0.065); // Dark midnight trench
  vec3 colAbyss       = vec3(0.0006, 0.005, 0.012); // Abyssal near-black

  vec3 waterColor = mix(colSurfaceTop, colSurfaceMid, smoothstep(0.0, 0.18, localDepth));
  waterColor = mix(waterColor, colTwilight, smoothstep(0.16, 0.45, localDepth));
  waterColor = mix(waterColor, colMidnight, smoothstep(0.42, 0.78, localDepth));
  waterColor = mix(waterColor, colAbyss, smoothstep(0.75, 1.0, localDepth));

  // Ambient sunlight falloff with depth
  float amb = pow(1.0 - d, 2.2);

  // 2. Submersible Lamp (valid smoothstep: edge0 < edge1)
  float lampDist = length(p - lampPos);
  float lampCone = 1.0 - smoothstep(0.0, 0.38, lampDist);
  float lampCore = (1.0 - smoothstep(0.0, 0.12, lampDist)) * 0.35;
  float lampDepthScale = 0.25 + 0.75 * smoothstep(0.1, 0.8, d);
  float torch = (lampCone + lampCore) * lampDepthScale * uFlicker;

  // 3. Sun God Rays (Surface to Twilight)
  if (amb > 0.02) {
    float rayWave = sin(p.x * 4.5 + p.y * 1.5 + uTime * 0.20);
    float rayNoise = noise(vec2(p.x * 2.6 + uTime * 0.05, p.y * 1.2));
    float rays = pow(clamp(rayWave * 0.45 + 0.55 + rayNoise * 0.25, 0.0, 1.0), 3.8);
    rays *= smoothstep(-0.2, 0.85, vUv.y) * amb * 0.16;
    vec3 rayColor = vec3(0.40, 0.85, 0.98);
    waterColor += rays * rayColor;
  }

  // 4. Shimmering Water Caustics
  float causticVal = caustics(p * 1.35 + vec2(0.0, d * 2.2), uTime * 0.40);
  vec3 causticColor = vec3(0.50, 0.92, 1.0);
  float causticLight = amb * 0.22 + torch * 0.15;
  waterColor += causticVal * causticColor * causticLight;

  // 5. Volumetric Mist & Fog
  float fogNoise = fbm(p * 2.0 + vec2(uTime * 0.03, -d * 4.5));
  vec3 fogTint = mix(vec3(0.02, 0.14, 0.20), vec3(0.005, 0.04, 0.09), smoothstep(0.15, 0.75, d));
  waterColor = mix(waterColor, fogTint * (0.35 + amb * 0.65), fogNoise * 0.25);

  // 6. Submersible Lamp Atmospheric Light Pool
  vec3 lampBeamColor = vec3(0.15, 0.52, 0.72);
  waterColor += lampBeamColor * torch * 0.35 * (0.4 + 0.6 * fogNoise) * smoothstep(0.12, 0.75, d);

  // 7. Marine Snow (3 parallax layers with scroll velocity elongation)
  float snow = 0.0;
  float velStretch = clamp(abs(uVel) * 0.06, 0.0, 2.5);
  for (int i = 0; i < 3; i++) {
    float layer = float(i);
    float k = 1.0 + layer * 0.85;
    vec2 q = p * (7.5 * k) + vec2(uTime * 0.035 * k, -d * (32.0 * k) + uTime * 0.10);
    vec2 g = floor(q);
    vec2 fr = fract(q) - 0.5;
    vec2 offset = (vec2(hash(g), hash(g + 17.0)) - 0.5) * 0.7;

    vec2 delta = fr - offset;
    delta.y /= (1.0 + velStretch);

    float pDist = length(delta);
    float pSize = 0.055 / (1.0 + velStretch * 0.35);
    // Strictly valid edge0 < edge1
    float flake = (1.0 - smoothstep(0.0, pSize, pDist)) * step(0.65, hash(g + 7.0)) / k;
    snow += flake;
  }
  vec3 snowColor = vec3(0.75, 0.94, 1.0);
  waterColor += snow * snowColor * (amb * 0.30 + torch * 0.75);

  // 8. Deep Bioluminescent Organisms (d > 0.32)
  if (d > 0.32) {
    float bioFbm = fbm(p * 3.2 + vec2(uTime * 0.05, -d * 7.0));
    float bioMask = smoothstep(0.60, 0.76, bioFbm) * smoothstep(0.32, 0.80, d);
    vec3 bioCyan = vec3(0.0, 0.95, 0.78);
    vec3 bioViolet = vec3(0.25, 0.40, 0.95);
    vec3 bioCol = mix(bioCyan, bioViolet, noise(p * 2.2 + uTime * 0.08));
    float pulse = 0.65 + 0.35 * sin(uTime * 2.0 + p.x * 4.5 + p.y * 2.5);
    waterColor += bioCol * bioMask * pulse * (0.28 + torch * 0.65);
  }

  // 9. Soft Cinematic Vignette
  float vignette = 1.0 - dot(vUv - 0.5, vUv - 0.5) * 1.25;
  waterColor *= clamp(vignette, 0.2, 1.0);

  // 10. Dithering to eliminate banding
  float dither = (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  waterColor += dither;

  gl_FragColor = vec4(clamp(waterColor, 0.0, 1.0), 1.0);
}
`;
