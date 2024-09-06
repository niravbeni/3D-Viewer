import React, { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { BubbleImageProps } from "./BubbleImage.types";

const BubbleImage: React.FC<BubbleImageProps> = ({ imageUrl, depthMapUrl }) => {
  const instancedMesh = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const [imageData, setImageData] = useState<Uint8ClampedArray | null>(null);
  const [depthData, setDepthData] = useState<Float32Array | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const samplingFactor = 10;
  const depthFactor = 1.5;

  useEffect(() => {
    const loadTexture = (url: string) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = url;
      });
    };

    Promise.all([loadTexture(imageUrl), loadTexture(depthMapUrl)]).then(
      ([img, depthImg]) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          setDimensions({ width: img.width, height: img.height });
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          ).data;
          setImageData(imgData);
          ctx.drawImage(depthImg, 0, 0);
          const depthImgData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          ).data;
          const depthArray = new Float32Array(depthImgData.length / 4);
          for (let i = 0; i < depthArray.length; i++) {
            depthArray[i] = depthImgData[i * 4] / 255;
          }
          setDepthData(depthArray);
        }
      }
    );
  }, [imageUrl, depthMapUrl]);

  const particleCount = useMemo(() => {
    return Math.floor(
      (dimensions.width * dimensions.height) / (samplingFactor * samplingFactor)
    );
  }, [dimensions, samplingFactor]);

  const colorArray = useMemo(
    () => new Float32Array(particleCount * 3),
    [particleCount]
  );

  useFrame((state) => {
    if (instancedMesh.current && imageData && depthData) {
      const time = state.clock.elapsedTime;
      const tempObject = new THREE.Object3D();
      let index = 0;

      for (let y = 0; y < dimensions.height; y += samplingFactor) {
        for (let x = 0; x < dimensions.width; x += samplingFactor) {
          const i = (y * dimensions.width + x) * 4;
          const xNorm = x / dimensions.width - 0.5;
          const yNorm = y / dimensions.height - 0.5;
          const depth = depthData[y * dimensions.width + x] || 0;

          tempObject.position.set(
            xNorm * 2 + Math.sin(time + yNorm * 10) * 0.03 * depth,
            -yNorm * 2 + Math.cos(time + xNorm * 10) * 0.03 * depth,
            depth * depthFactor
          );

          tempObject.scale.setScalar(0.5 + depth * 0.5);

          tempObject.updateMatrix();
          instancedMesh.current.setMatrixAt(index, tempObject.matrix);

          colorArray[index * 3] = imageData[i] / 255;
          colorArray[index * 3 + 1] = imageData[i + 1] / 255;
          colorArray[index * 3 + 2] = imageData[i + 2] / 255;

          index++;
        }
      }

      instancedMesh.current.instanceMatrix.needsUpdate = true;

      const colorAttribute = instancedMesh.current.geometry.getAttribute(
        "color"
      ) as THREE.InstancedBufferAttribute;
      colorAttribute.copyArray(colorArray);
      colorAttribute.needsUpdate = true;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.01, 16, 16);
    geo.setAttribute(
      "color",
      new THREE.InstancedBufferAttribute(colorArray, 3)
    );
    return geo;
  }, [colorArray]);

  if (!imageData || !depthData) return null;

  return (
    <instancedMesh
      ref={instancedMesh}
      args={[geometry, undefined, particleCount]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <meshBasicMaterial vertexColors />
    </instancedMesh>
  );
};

export default BubbleImage;
