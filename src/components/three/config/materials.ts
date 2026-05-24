import * as THREE from "three";

/**
 * Creates the premium "Bronze Cacao" material
 * Optimized for both Desktop (Quality) and Mobile (Performance)
 */
export const createPremiumMaterial = (isMobile: boolean) => {
  return new THREE.MeshStandardMaterial({
    color: "#3E2723",        // Marron cacao profond
    metalness: 0.85,         // Très métallique -> aspect bronze / statue
    roughness: isMobile ? 0.22 : 0.18, // Très lisse (plus stable sur mobile)
    envMapIntensity: isMobile ? 1.2 : 1.6, // Intensité des reflets HDRI
  });
};
