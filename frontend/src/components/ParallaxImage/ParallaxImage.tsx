import { FC, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ParallaxImageProps } from "./ParallaxImage.types";
import vertexShader from "../../shaders/parallaxImage/vertexShader.glsl";
import fragmentShader from "../../shaders/parallaxImage/fragmentShader.glsl";

const ParallaxImage: FC<ParallaxImageProps> = ({ imageUrl, depthMapUrl }) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const texture = useTexture(imageUrl);
  const depthMap = useTexture(depthMapUrl);
  const { viewport, pointer } = useThree();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMouse.value.set(
        pointer.x * 0.01,
        pointer.y * 0.01
      );
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uMouse: { value: new THREE.Vector2(0, 0) },
          uImage: { value: texture },
          uDepthMap: { value: depthMap },
        }}
      />
    </mesh>
  );
};

export default ParallaxImage;
