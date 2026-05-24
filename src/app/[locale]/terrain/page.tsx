"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import ProceduralTerrain from "@/components/ProceduralTerrain";
import { Environment } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

function CameraController({ scrollProgress }: { scrollProgress: number }) {
  useFrame((state) => {
    // Cinematic Camera Movement
    // Start: High and far [0, 4, 6]
    // End: Low and close/forward [0, 1.5, 2]
    
    const startPos = new THREE.Vector3(0, 4, 6);
    const endPos = new THREE.Vector3(0, 1.5, 2);
    
    // Lerp position based on scroll
    state.camera.position.lerpVectors(startPos, endPos, scrollProgress);
    
    // Look at slightly ahead of center
    // As we scroll, look further into the distance
    const lookAtStart = new THREE.Vector3(0, 0, 0);
    const lookAtEnd = new THREE.Vector3(0, 0, -2);
    const currentLookAt = new THREE.Vector3().lerpVectors(lookAtStart, lookAtEnd, scrollProgress);
    
    state.camera.lookAt(currentLookAt);
  });
  return null;
}

export default function TerrainPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrubbing
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "400vh" }}>
      {/* Fixed Canvas Background */}
      <div className="fixed top-0 left-0 w-full h-screen z-0 bg-black">
        <Canvas
          camera={{ position: [0, 4, 6], fov: 45 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          dpr={[1, 2]} // Optimize for pixel ratio
        >
          <Suspense fallback={null}>
            {/* Environment for reflections (even if we use custom shader, good to have) */}
            <Environment preset="sunset" />
            
            {/* The Procedural Terrain */}
            <ProceduralTerrain scrollProgress={scrollProgress} />
            
            {/* Camera Animation */}
            <CameraController scrollProgress={scrollProgress} />
            
            {/* Fog for depth */}
            <fog attach="fog" args={['#2A1C15', 2, 12]} />
          </Suspense>
        </Canvas>
      </div>

      {/* Foreground Content (Optional, to show it's a website) */}
      <div className="relative z-10 pointer-events-none">
        <section className="h-screen flex items-center justify-center">
          <h1 className="text-5xl md:text-7xl font-serif text-white mix-blend-difference opacity-80">
            {t('title')}
          </h1>
        </section>
        
        <section className="h-screen flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mix-blend-difference opacity-80">
            {t('biomes.dunes')}
          </h2>
        </section>
        
        <section className="h-screen flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mix-blend-difference opacity-80">
            {t('biomes.rock')}
          </h2>
        </section>
        
        <section className="h-screen flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mix-blend-difference opacity-80">
            {t('completion')}
          </h2>
        </section>
      </div>
    </div>
  );
}
