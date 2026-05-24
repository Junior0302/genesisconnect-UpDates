import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

/**
 * Hook to handle Scroll interactions
 * Rotates the model based on page scroll position
 */
export function useModelScroll(groupRef: React.RefObject<THREE.Group | null>) {
  const smoothedProgress = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Get scroll percentage (0 to 1 approx)
    const scrollY = window.scrollY;
    // Use document.documentElement.scrollHeight for better cross-browser support
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetProgress = Math.min(scrollY / (maxScroll || 1), 1);

    // Smooth the progress for fluidity
    // Using lerp to interpolate between current and target value
    
    // Smoothness Factor
    // 1.8 = Sweet spot. Not too laggy (was 1.0), not too snappy (was 2.5/4.0)
    smoothedProgress.current = THREE.MathUtils.lerp(
      smoothedProgress.current, 
      targetProgress, 
      delta * 1.8
    );
    
    const progress = smoothedProgress.current;

    // Choreography "Dynamic Flow" (Plus actif)
    // Increased amplitude and frequency for more noticeable movement

    // 1. Lateral Movement (X axis)
    // Wider sweep to cover more screen width
    groupRef.current.position.x = 
      -Math.sin(progress * Math.PI * 3.5) * 3.5 + 
      Math.sin(progress * Math.PI * 5.0) * 1.2;

    // 2. Vertical Floating (Y axis)
    // More dramatic ups and downs
    groupRef.current.position.y = 
      -1 + 
      Math.sin(progress * Math.PI * 5.0) * 1.2;

    // 3. Rotation (Y axis) - "Plus expressif"
    // Increased range to ~90 degrees (1.6 radians) for better 3D appreciation
    groupRef.current.rotation.y = 
      Math.sin(progress * Math.PI * 4.0) * 1.6; 

    // 4. Depth (Z axis)
    // Deeper zooms to create more impact
    groupRef.current.position.z = 
      Math.cos(progress * Math.PI * 4.0) * 4.0;
  });
}
