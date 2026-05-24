"use client";

import { useEffect, useRef, ReactNode } from "react";
import gsap from "gsap";

interface InkRevealProps {
  onComplete: () => void;
  reveal: boolean;
  children?: ReactNode;
}

export default function InkReveal({ onComplete, reveal, children }: InkRevealProps) {
  const bgRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 0. Initial Setup (Always applied)
    if (bgRef.current) {
        gsap.set(bgRef.current, { 
            scaleY: 1, // Start NORMAL (Not deformed)
            transformOrigin: "bottom center" // Scale from bottom
        });
    }

    // Only run animation if reveal is true
    if (!reveal) return;

    // CONFIGURATION
    // Reduced duration from 3.5s to 3.0s as requested ("un peu plus vite")
    const duration = 3.0; 
    // const color = "#F0EAE0"; // Couleur du liquide (Broken White)

    // Paths from project.000292005/index.html
    const smallPath = "M -44,-50 C -52.71,28.52 15.86,8.186 184,14.69 383.3,22.39 462.5,12.58 638,14 835.5,15.6 987,6.4 1194,13.86 1661,30.68 1652,-36.74 1582,-140.1 1512,-243.5 15.88,-589.5 -44,-50 Z";
    
    // Big Path (Artist V3: Massive liquid drop, extreme coverage)
    // Structure strictly matches smallPath (5 Cubic Beziers) but coordinates are pushed to extremes
    // This creates a heavy, "hanging" liquid feel that covers everything
    const bigPath = "M -600,-50 C -500,400 -200,1800 200,1800 500,1800 600,1400 800,1400 1000,1400 1200,1900 1500,1900 2000,1900 2200,500 2000,-100 1800,-600 0,-600 -600,-50 Z";

    const tl = gsap.timeline({
      onComplete: onComplete
    });

    // 0. Animate Content Out (Text + Button)
    if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('.intro-element');
        if (elements.length > 0) {
            tl.to(elements, {
                y: -50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.inOut"
            }, 0);
        }
    }

    // 1. Path Morph (Big -> Small)
    if (pathRef.current) {
      // Set initial path
      pathRef.current.setAttribute("d", bigPath);
      
      tl.to(pathRef.current, {
        attr: { d: smallPath },
        duration: duration,
        ease: "power2.inOut",
      }, 0.2); // Start slightly after text starts moving
    }

    // 2. Elastic Scale Animation (The "Deformation" during movement only)
    if (bgRef.current) {
        tl.to(bgRef.current, {
            scaleY: 1.6, // Moderate deformation upwards
            duration: duration * 0.5,
            ease: "power2.in", 
        }, 0.2)
        .to(bgRef.current, {
            scaleY: 1.0, // Snap back
            duration: duration * 0.5,
            ease: "power2.out", 
        }, ">");
    }

  }, [reveal, onComplete]);

  return (
    <div className="fixed left-0 bottom-0 w-full h-full overflow-hidden z-50">
        {/* Background Layer (The Ink) */}
        <div 
                ref={bgRef}
                className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
                style={{ transformOrigin: 'bottom center' }}
            >
                <svg 
                    className="w-full h-full block"
                    viewBox="0 0 1440 800" 
                    preserveAspectRatio="none"
                >
                    <defs>
                        <filter id="noiseFilter">
                            <feTurbulence 
                                type="fractalNoise" 
                                baseFrequency="0.6" 
                                stitchTiles="stitch" 
                                numOctaves="3"
                                result="noise" 
                            />
                            <feColorMatrix 
                                in="noise" 
                                type="matrix"
                                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0 0 0 0" 
                                result="noiseAlpha"
                            />
                            <feComposite 
                                operator="in" 
                                in="noiseAlpha" 
                                in2="SourceGraphic" 
                                result="composite"
                            />
                            <feBlend 
                                in="composite" 
                                in2="SourceGraphic" 
                                mode="multiply" 
                            />
                        </filter>
                    </defs>
                    <path 
                        ref={pathRef} 
                        d="M -600,-50 C -500,400 -200,1800 200,1800 500,1800 600,1400 800,1400 1000,1400 1200,1900 1500,1900 2000,1900 2200,500 2000,-100 1800,-600 0,-600 -600,-50 Z" 
                        fill="#F0EAE0"
                        filter="url(#noiseFilter)"
                    />
                </svg>
            </div>
            <div ref={contentRef} className="relative z-10 w-full h-full">
                {children}
            </div>
    </div>
  );
}
