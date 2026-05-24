/**
 * Configuration for the 3D Model placement and scale
 */
export const MODEL_CONFIG = {
  // Desktop Settings
  scale: 13,             // Reduced from 15
  position: [0, -23, 0], // Adjusted for new scale (was -26)
  
  // Mobile Settings
  scaleMobile: 8.5,      // Significantly reduced for mobile
  positionMobile: [0, -15, 0], // Adjusted for mobile scale
  
  rotation: [0, 0, 0],   
} as const;
