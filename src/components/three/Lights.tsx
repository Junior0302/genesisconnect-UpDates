import { Environment } from "@react-three/drei";

export default function Lights() {
  return (
    <>
      {/* Key Light: Main source, soft, from top-right */}
      <spotLight 
        position={[5, 5, 15]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        castShadow 
        shadow-bias={-0.0001}
      />
      
      {/* Fill Light: Weaker, from opposite side, fills shadows */}
      <pointLight position={[-5, 0, 15]} intensity={0.5} color="#E0D0C0" />
      
      {/* Rim Light: Backlight to separate model from background */}
      <spotLight 
        position={[0, 5, -10]} 
        intensity={3} 
        color="#FFFFFF" 
        angle={0.5} 
        penumbra={1}
      />
      
      {/* HDRI Environment for premium metal reflections */}
      <Environment preset="city" />
    </>
  );
}
