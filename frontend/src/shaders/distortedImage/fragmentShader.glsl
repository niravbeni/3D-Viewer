// uniform sampler2D tDiffuse;
// uniform sampler2D tDepth;
// uniform float distortionFactor;
// varying vec2 vUv;

// void main() {
//   vec4 depthColor = texture2D(tDepth, vUv);
//   float depth = (depthColor.r + depthColor.g + depthColor.b) / 3.0;
  
//   vec2 distortedUv = vUv + vec2(
//     sin(vUv.y * 10.0 + depth * distortionFactor) * 0.01,
//     cos(vUv.x * 10.0 + depth * distortionFactor) * 0.01
//   );
  
//   gl_FragColor = texture2D(tDiffuse, distortedUv);
// }

uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform float distortionFactor;
varying vec2 vUv;

void main() {
  vec4 depthColor = texture2D(tDepth, vUv);
  float depth = (depthColor.r + depthColor.g + depthColor.b) / 3.0;
  
  // Create a more pronounced 3D effect
  vec2 distortedUv = vUv + vec2(
    sin(vUv.y * 10.0 + depth * distortionFactor) * 0.05 * depth,
    cos(vUv.x * 10.0 + depth * distortionFactor) * 0.05 * depth
  );
  
  // Add a subtle parallax effect
  vec2 parallaxOffset = vec2(0.02, 0.02) * depth;
  vec4 color = texture2D(tDiffuse, distortedUv - parallaxOffset);
  
  // Adjust lighting based on depth
  float lighting = 1.0 - depth * 0.5;
  color.rgb *= lighting;
  
  gl_FragColor = color;
}

// uniform sampler2D tDiffuse;

// varying vec2 vUv;
// varying float vDepth;

// void main() {
//     vec4 texColor = texture2D(tDiffuse, vUv);
    
//     // Simple lighting effect based on depth
//     float lightIntensity = 1.0 - vDepth * 0.5;
    
//     gl_FragColor = vec4(texColor.rgb * lightIntensity, texColor.a);
// }

