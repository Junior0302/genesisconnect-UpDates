"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ArrowUp } from "lucide-react";

export default function ScrollControls() {
  const pathname = usePathname();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const backToTopRef = useRef<HTMLButtonElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // 1. Calculate Scroll Progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (windowHeight > 0) {
        const scroll = totalScroll / windowHeight;
        setScrollProgress(Number(scroll));

        // Check if at bottom (more generous threshold)
        if (windowHeight - totalScroll < 100) {
            setIsAtBottom(true);
        } else {
            setIsAtBottom(false);
        }
      }

      // 2. Threshold for Back to Top Button
      if (totalScroll > 500) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Back to Top Animation (Appearance + Pulse)
  useEffect(() => {
    if (showBackToTop) {
        // Appear
        gsap.to(backToTopRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.2)"
        });

        // Pulse Animation Loop
        const pulseAnim = gsap.to(backToTopRef.current, {
            boxShadow: "0 0 15px rgba(250, 249, 246, 0.3)",
            scale: 1.1,
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        return () => {
            pulseAnim.kill();
            gsap.to(backToTopRef.current, {
                scale: 1,
                boxShadow: "none",
                duration: 0.3
            });
        };

    } else {
        gsap.to(backToTopRef.current, {
            scale: 0.5,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in"
        });
    }
  }, [showBackToTop]);

  // Left Indicator Animation (Looping Line)
  useEffect(() => {
    if (!scrollIndicatorRef.current) return;

    // Kill previous animations
    gsap.killTweensOf(scrollIndicatorRef.current);

    if (isAtBottom) {
        // Animate Upwards when at bottom (Slower: 3s)
        gsap.fromTo(scrollIndicatorRef.current,
            { y: "100%", opacity: 0 },
            { y: "-100%", opacity: 1, duration: 3, repeat: -1, ease: "power1.inOut" }
        );
    } else {
        // Animate Downwards otherwise (Slower: 3s)
        gsap.fromTo(scrollIndicatorRef.current,
            { y: "-100%", opacity: 0 },
            { y: "100%", opacity: 1, duration: 3, repeat: -1, ease: "power1.inOut" }
        );
    }

  }, [isAtBottom, pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 
        INTEGRATED LEFT LINE & SCROLL INDICATOR 
        - Visual anchor + scroll progress bar
      */}
      <div 
        className="fixed top-0 bottom-0 z-40 w-[1px] bg-[#FAF9F6]/5 pointer-events-none"
        style={{ left: "var(--decor-offset)" }}
      >
        {/* Animated Scroll Hint (Moving Line inside the track) */}
        <div className="absolute top-0 bottom-0 left-0 w-full overflow-hidden">
             <div 
                ref={scrollIndicatorRef}
                className={`absolute left-0 top-1/2 -mt-16 w-full h-32 bg-gradient-to-b ${isAtBottom ? 'from-transparent via-[#FAF9F6] to-transparent' : 'from-transparent via-[#FAF9F6] to-transparent'}`}
                style={{ opacity: 0.5 }}
             />
        </div>
      </div>

      {/* BACK TO TOP BUTTON */}
      <button
        ref={backToTopRef}
        onClick={scrollToTop}
        className="fixed bottom-6 md:bottom-12 right-6 md:right-12 z-40 w-12 h-12 rounded-full border border-[#FAF9F6]/20 flex items-center justify-center bg-[#2A1C15]/10 backdrop-blur-md text-[#FAF9F6] hover:bg-[#FAF9F6] hover:text-[#2A1C15] hover:border-[#FAF9F6] transition-all duration-500 opacity-0 scale-0 group"
        aria-label="Back to top"
      >
        <ArrowUp strokeWidth={1} size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </>
  );
}
