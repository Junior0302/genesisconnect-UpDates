"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function EditorialLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!lineRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    // 1. Primary "Leader" Drop - Fast, Bright, Glowing
    // Creates the initial impulse to look down
    tl.fromTo(".drop-leader",
      { top: "-50%", opacity: 0 },
      { 
        top: "120%", 
        opacity: 1, 
        duration: 2, 
        ease: "power2.inOut",
        keyframes: {
            "0%":   { opacity: 0 },
            "15%":  { opacity: 1 }, // Quick flash in
            "85%":  { opacity: 1 },
            "100%": { opacity: 0 }
        }
      }
    );

    // 2. Secondary "Echo" Drop - Slower, softer, follows the leader
    // Adds complexity and liquid feel
    gsap.fromTo(".drop-echo",
      { top: "-50%", opacity: 0 },
      { 
        top: "120%", 
        opacity: 0.4, 
        duration: 2.2, 
        ease: "power2.inOut",
        delay: 0.2, // Slight lag
        repeat: -1,
        repeatDelay: 0, // Continuous flow
        keyframes: {
            "0%":   { opacity: 0 },
            "20%":  { opacity: 0.4 },
            "80%":  { opacity: 0.4 },
            "100%": { opacity: 0 }
        }
      }
    );

  }, { scope: lineRef });

  return (
    <div 
      ref={lineRef}
      className="absolute left-0 top-0 bottom-0 w-[1px] bg-[#FAF9F6]/5 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Primary Bright Drop with Glow */}
      <div className="drop-leader absolute left-0 w-full h-[180px] bg-gradient-to-b from-transparent via-[#FAF9F6] to-transparent shadow-[0_0_15px_1px_rgba(250,249,246,0.6)]" />
      
      {/* Secondary Soft Echo */}
      <div className="drop-echo absolute left-0 w-full h-[250px] bg-gradient-to-b from-transparent via-[#FAF9F6]/30 to-transparent" />
    </div>
  );
}
