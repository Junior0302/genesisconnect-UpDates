"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function InlineScrollHint({ className = "" }: { className?: string }) {
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!scrollHintRef.current) return;
    
    const tl = gsap.timeline({ repeat: -1 });
    
    tl.fromTo(".scroll-line-inner", 
      { y: "-100%" },
      { y: "100%", duration: 2, ease: "power2.inOut" }
    );
  }, { scope: scrollHintRef });

  return (
    <div 
      ref={scrollHintRef}
      className={`flex flex-col gap-4 mt-12 opacity-60 ${className}`}
    >
       <span className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6] font-medium">
          Scroll
       </span>
       <div className="w-[1px] h-16 bg-[#FAF9F6]/20 overflow-hidden relative">
          <div className="scroll-line-inner absolute top-0 left-0 w-full h-full bg-[#FAF9F6]"></div>
       </div>
    </div>
  );
}
