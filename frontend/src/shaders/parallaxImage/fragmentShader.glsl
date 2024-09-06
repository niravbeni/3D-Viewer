precision mediump float;

uniform vec2 uMouse;
uniform sampler2D uImage;
uniform sampler2D uDepthMap;
varying vec2 vUv;

void main() {
  vec4 depthDistortion = texture2D(uDepthMap, vUv);
  float parallaxMult = depthDistortion.r;
  vec2 parallax = (uMouse) * parallaxMult;
  gl_FragColor = texture2D(uImage, (vUv + parallax));
}


