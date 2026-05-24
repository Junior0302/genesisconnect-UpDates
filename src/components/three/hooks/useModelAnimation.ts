import { useAnimations } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";

/**
 * Hook to handle FBX animations
 * Automatically plays the first available animation (usually Idle/Standing)
 */
export function useModelAnimation(
  animations: THREE.AnimationClip[],
  groupRef: React.RefObject<THREE.Group | null>
) {
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    // Play the first available animation by default if it exists
    if (names.length > 0) {
      const actionName = names[0];
      const action = actions[actionName];
      
      if (action) {
        // Reset and fade in for smooth start
        action.reset().fadeIn(0.5).play();
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (names.length > 0) {
        actions[names[0]]?.fadeOut(0.5);
      }
    };
  }, [actions, names]);

  return { actions, names };
}
