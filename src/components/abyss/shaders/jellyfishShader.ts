/**
 * Custom GLSL Shader for Translucent Bioluminescent Jellyfish in the Twilight/Midnight zones.
 * Features:
 * - Vertex pulsation: rhythmic bell expansion and contraction.
 * - Fresnel edge rim glow: glowing oceanic translucency.
 * - Bioluminescent inner bell core.
 * - Zone depth crossfade.
 */

export const jellyfishVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

uniform float uTime;
uniform float uPulseOffset;

void main() {
  vUv = uv;
  vec3 pos = position;

  // Rhythmic bell contraction (expanding horizontally while contracting vertically)
  float pulse = sin(uTime * 2.2 + uPulseOffset);
  float contraction = max(0.0, pulse);
  pos.y += contraction * 0.18 * (1.0 - uv.y);
  pos.xz *= 1.0 - contraction * 0.14 * (1.0 - uv.y);

  // Subtle undulating ruffle on skirt
  pos.x += sin(pos.y * 8.0 + uTime * 3.0) * 0.03 * uv.y;
  pos.z += cos(pos.y * 8.0 + uTime * 3.0) * 0.03 * uv.y;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const jellyfishFragmentShader = /* glsl */ `
precision highp float;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

uniform float uTime;
uniform float uDepth;
uniform vec3 uColor;
uniform float uZoneVisibility;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // Fresnel rim glow
  float fresnel = 1.0 - abs(dot(normal, viewDir));
  fresnel = pow(clamp(fresnel, 0.0, 1.0), 2.2);

  // Bioluminescent pulsating core
  float corePulse = 0.65 + 0.35 * sin(uTime * 2.5);
  float coreGlow = smoothstep(0.7, 0.0, vUv.y) * corePulse;

  // Jellyfish color blend (translucent cyan-blue with luminous edge)
  vec3 bodyColor = mix(vec3(0.02, 0.15, 0.22), uColor, coreGlow * 0.7);
  vec3 glowColor = mix(uColor, vec3(0.8, 1.0, 1.0), 0.4);
  vec3 finalColor = bodyColor + glowColor * fresnel * 1.6;

  float alpha = clamp((fresnel * 0.85 + coreGlow * 0.45) * uZoneVisibility, 0.0, 0.9);

  gl_FragColor = vec4(finalColor, alpha);
}
`;
