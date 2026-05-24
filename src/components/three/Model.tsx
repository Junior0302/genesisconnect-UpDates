"use client";

import { useFBX } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { createPremiumMaterial } from "./config/materials";
import { MODEL_CONFIG } from "./config/modelSettings";
import { useModelAnimation } from "./hooks/useModelAnimation";
import { useModelScroll } from "./hooks/useModelScroll";

import { GroupProps } from "@react-three/fiber";

export default function Model(props: GroupProps) {
  const fbx = useFBX("/model/Standing.fbx");
  const ref = useRef<THREE.Group>(null);
  
  // Responsive State
  const [scale, setScale] = useState<number>(MODEL_CONFIG.scale);
  const [position, setPosition] = useState<[number, number, number] | number[]>(MODEL_CONFIG.position);

  // 1. Setup Responsive Scale & Material
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      
      // Update Scale & Position
      setScale(isMobile ? MODEL_CONFIG.scaleMobile : MODEL_CONFIG.scale);
      // @ts-expect-error - Tuple vs Array type compatibility
      setPosition(isMobile ? MODEL_CONFIG.positionMobile : MODEL_CONFIG.position);
      
      // Update Material (Mobile needs lighter calculation)
      const material = createPremiumMaterial(isMobile);
      fbx.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          mesh.material = material;
          mesh.frustumCulled = false;
        }
      });
    };

    // Initial Call
    handleResize();

    // Event Listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fbx]);

  // 2. Setup Animations (from FBX)
  useModelAnimation(fbx.animations, ref);

  // 3. Setup Scroll Interaction
  useModelScroll(ref);

  return (
    <group ref={ref} {...props} dispose={null}>
      <primitive 
        object={fbx} 
        scale={scale} 
        position={position} 
      />
    </group>
  );
}
