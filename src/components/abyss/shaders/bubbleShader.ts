/**
 * Custom GLSL Shader for Submersible Bubble Trails.
 * Spawns when scroll velocity is elevated; bubbles wobble, stretch, and catch lamp light.
 */

export const bubbleVertexShader = /* glsl */ `
varying vec2 vUv;
varying vec3 vViewPosition;

attribute float aScale;
attribute float aPhase;
attribute vec3 aVelocity;

uniform float uTime;
uniform float uScrollSpeed;

void main() {
  vUv = uv;

  // Stretch slightly in the direction of vertical scroll velocity
  vec3 pos = position;
  float stretch = 1.0 + clamp(abs(uScrollSpeed) * 12.0, 0.0, 0.8);
  pos.y *= stretch;

  // Gentle wobble
  pos.x += sin(uTime * 4.0 + aPhase) * 0.04;
  pos.z += cos(uTime * 3.5 + aPhase) * 0.04;

  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const bubbleFragmentShader = /* glsl */ `
precision highp float;

varying vec2 vUv;
varying vec3 vViewPosition;

uniform float uTime;
uniform float uScrollSpeed;
uniform vec2 uLamp;

void main() {
  vec2 p = vUv - 0.5;
  float dist = length(p);
  if (dist > 0.5) discard;

  // Bubble rim Fresnel
  float rim = smoothstep(0.3, 0.5, dist);
  float specular = pow(max(0.0, 1.0 - length(p - vec2(-0.15, 0.15)) * 3.2), 3.0);

  vec3 bubbleColor = mix(vec3(0.37, 0.95, 0.88), vec3(0.9, 0.98, 1.0), specular);
  float alpha = (rim * 0.4 + specular * 0.7) * clamp(abs(uScrollSpeed) * 35.0, 0.0, 0.75);

  gl_FragColor = vec4(bubbleColor, alpha);
}
`;
