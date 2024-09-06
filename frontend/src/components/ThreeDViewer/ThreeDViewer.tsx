import { FC, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CanvasContainer } from "./ThreeDViewer.styles";

import { ThreeDViewerProps, CameraAdjusterProps } from "./ThreeDViewer.types";
import ParallaxImage from "../ParallaxImage/ParallaxImage";

const CameraAdjuster: FC<CameraAdjusterProps> = ({ zPosition }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, zPosition);
    camera.lookAt(0, 0, 0);
  }, [camera, zPosition]);

  return null;
};

const ThreeDViewer: FC<ThreeDViewerProps> = ({
  imageUrl,
  depthMapUrl,
  zPosition,
}) => {
  return (
    <CanvasContainer>
      <Canvas linear flat camera={{ fov: 75, near: 0.1, far: 1000 }}>
        <CameraAdjuster zPosition={zPosition} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={40}
        />
        <ParallaxImage imageUrl={imageUrl} depthMapUrl={depthMapUrl} />
      </Canvas>
    </CanvasContainer>
  );
};

export default ThreeDViewer;
