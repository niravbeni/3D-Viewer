// varying vec2 vUv;

// void main() {
//   vUv = uv;
//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }

uniform sampler2D tDepth;
uniform float displacementScale;

varying vec2 vUv;
varying float vDepth;

void main() {
    vUv = uv;
    
    // Sample the depth map
    vec4 depthColor = texture2D(tDepth, uv);
    float depth = (depthColor.r + depthColor.g + depthColor.b) / 3.0;
    
    // Displace the vertex along its normal
    vec3 displaced = position + normal * depth * displacementScale;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    
    // Pass the depth to the fragment shader
    vDepth = depth;
}