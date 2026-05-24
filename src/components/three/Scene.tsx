"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useTransition } from "@/context/TransitionContext";
import { usePathname } from "next/navigation";
import Model from "./Model";
import Lights from "./Lights";
import { CAMERA_CONFIG } from "./config/cameraSettings";

export default function Scene() {
  const { progress } = useProgress();
  const { setAssetsLoaded } = useTransition();
  const pathname = usePathname();

  useEffect(() => {
    // Report loading status to TransitionContext
    if (progress === 100) {
      setAssetsLoaded(true);
    }
  }, [progress, setAssetsLoaded]);

  // Only render Scene on Home Page (checking all locales)
  const isHome = pathname === "/" || ["/fr", "/en", "/zh"].includes(pathname);
  if (!isHome) return null;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={CAMERA_CONFIG}
      gl={{ antialias: true, alpha: true }}
      className="!fixed !inset-0 !w-full !h-full !z-10 pointer-events-none"
    >
      <Suspense fallback={null}>
        <Lights />
        <Model />
      </Suspense>
    </Canvas>
  );
}
