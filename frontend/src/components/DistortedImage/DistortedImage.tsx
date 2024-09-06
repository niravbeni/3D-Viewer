import { FC, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { DistortedImageProps } from "./DistortedImage.types";

import vertexShader from "../../shaders/distortedImage/vertexShader.glsl";
import fragmentShader from "../../shaders/distortedImage/fragmentShader.glsl";

const DistortedImage: FC<DistortedImageProps> = ({ imageUrl, depthMapUrl }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      tDiffuse: { value: new THREE.TextureLoader().load(imageUrl) },
      tDepth: { value: new THREE.TextureLoader().load(depthMapUrl) },
      distortionFactor: { value: 0.5 },
      displacementScale: { value: 1.1 },
    }),
    [imageUrl, depthMapUrl]
  );

  useFrame((state) => {
    if (mesh.current?.material instanceof THREE.ShaderMaterial) {
      mesh.current.material.uniforms.distortionFactor.value =
        5.0 + Math.sin(state.clock.elapsedTime) * 2.0;
    }
  });
  return (
    <mesh ref={mesh} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1, 256, 256]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
};

export default DistortedImage;
