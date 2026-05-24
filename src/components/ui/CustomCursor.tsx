"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTransition } from "@/context/TransitionContext";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const { currentState } = useTransition();

  // Hide cursor during loading/intro text phases
  const isHidden = currentState === 'LOADING_ASSETS' || currentState === 'INTRO_TEXT';

  useGSAP(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Center the cursor on the mouse point
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: hasMoved ? 1 : 0 });

    const moveCursor = (e: MouseEvent) => {
      // Make visible on first move
      if (!hasMoved) {
        gsap.to(cursor, { opacity: 1, duration: 0.5 });
        setHasMoved(true);
      }

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [hasMoved, isHidden]);

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the target or its parents are clickable
      const isClickable = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.classList.contains("cursor-pointer");

      setIsHovering(!!isClickable);
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    if (isHovering) {
      gsap.to(cursor, {
        scale: 2.5,
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(cursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isHovering]);

  if (isHidden) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-[#FAF9F6] rounded-full pointer-events-none z-[11000] mix-blend-difference"
    />
  );
}
