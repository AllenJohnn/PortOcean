/**
 * Custom GLSL Shader for the ABYSS 3D Project Specimen textured planes.
 * Features:
 * - Lamp-lit only illumination (ambient light fades with depth, revealed by lamp cone).
 * - Animated water caustic overlay.
 * - Gentle refraction ripple that surges on hover.
 * - Faint cyan (#5ff2e0) rim glow with hover amplification.
 */

export const specimenVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec2 vScreenPos;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 clipPos = projectionMatrix * viewMatrix * worldPos;
  // Convert normalized device coordinates to [0, 1] screen UV for lamp proximity
  vScreenPos = (clipPos.xy / clipPos.w) * 0.5 + 0.5;
  gl_Position = clipPos;
}
`;

export const specimenFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec2 vScreenPos;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uDepth;
uniform vec2 uLamp;
uniform float uHover;

void main() {
  // 1. Refraction ripple: gentle oceanic wave distortion that surges on hover
  float rippleStrength = 0.003 + uHover * 0.012;
  vec2 ripple = vec2(
    sin(vUv.y * 14.0 + uTime * 2.2) * cos(vUv.x * 10.0 + uTime * 1.5),
    cos(vUv.x * 14.0 + uTime * 2.2) * sin(vUv.y * 10.0 + uTime * 1.5)
  ) * rippleStrength;

  vec2 uv = clamp(vUv + ripple, 0.001, 0.999);
  vec4 tex = texture2D(uTexture, uv);

  // 2. Ambient light and lamp cone illumination
  // Ambient fades from ~0.60 at surface to 0.04 at seabed
  float ambient = pow(1.0 - uDepth, 2.0) * 0.55 + 0.05;

  // Lamp cone proximity calculation
  float distToLamp = length(vScreenPos - uLamp);
  float lampIntensity = 1.0 - smoothstep(0.0, 0.44, distToLamp);

  // Light factor (min 10% visibility so textures are faintly discoverable)
  float light = clamp(ambient + lampIntensity * (0.85 + 0.45 * uHover), 0.10, 1.0);

  // 3. Caustic overlay
  float causticWave = sin(uv.x * 24.0 + uTime * 1.8) * cos(uv.y * 24.0 + uTime * 1.4);
  float caustic = pow(abs(causticWave), 4.0) * 0.30 * light;
  vec3 causticColor = vec3(0.37, 0.95, 0.88) * caustic;

  // 4. Faint cyan rim glow (#5ff2e0)
  float edgeX = smoothstep(0.0, 0.05, vUv.x) * (1.0 - smoothstep(0.95, 1.0, vUv.x));
  float edgeY = smoothstep(0.0, 0.05, vUv.y) * (1.0 - smoothstep(0.95, 1.0, vUv.y));
  float rim = 1.0 - (edgeX * edgeY);
  vec3 cyanGlow = vec3(0.37, 0.95, 0.88) * rim * (0.35 + 0.65 * uHover);

  // 5. Compose lit color with subtle oceanic water absorption tint
  vec3 rgb = tex.rgb * light;
  rgb = mix(rgb, rgb * vec3(0.65, 0.88, 1.0), uDepth * 0.35);
  rgb += causticColor + cyanGlow;

  // Soft border vignette
  float cornerFade = smoothstep(0.0, 0.015, vUv.x) * (1.0 - smoothstep(0.985, 1.0, vUv.x)) *
                     smoothstep(0.0, 0.015, vUv.y) * (1.0 - smoothstep(0.985, 1.0, vUv.y));

  gl_FragColor = vec4(rgb, cornerFade * tex.a * (0.3 + 0.7 * light));
}
`;
