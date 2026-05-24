"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSoundContext } from "./SoundContext";

import Logo from "@/components/ui/Logo";

import InkReveal from "@/components/ui/InkReveal";

// 1. DEFINITION DES ETATS (State Machine)
type IntroState = 
  | 'LOADING_ASSETS'      // State 0: Chargement technique, pas d'interaction
  | 'INTRO_TEXT'          // State 1: "From idea to impact", lecture seule
  | 'INTRO_READY'         // State 2: Bouton ENTER apparait, interaction possible
  | 'INK_MORPH_REVEAL'    // State 3: Transition vers le site (Ink Morph + Son + FadeOut Text)
  | 'EXPERIENCE_RUNNING'; // State 4: Site actif

interface TransitionContextType {
  navigate: (href: string) => void;
  currentState: IntroState;
  setAssetsLoaded: (loaded: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { playSound, initAudio, isInitialized: isAudioInitialized } = useSoundContext();
  const t = useTranslations('Transition');
  
  // PAGE TRANSITION STATE
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // INTRO STATE MACHINE
  const [currentState, setCurrentState] = useState<IntroState>('LOADING_ASSETS');
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  
  // New state to trigger exit animations (Text -> Button -> Curtain)
  const [isExiting, setIsExiting] = useState(false);
  
  // Refs pour l'intro
  const introOverlayRef = useRef<HTMLDivElement>(null);

  // 1. INITIALISATION & LOGIQUE D'ETATS
  useGSAP(() => {
    // Check session storage first
    // POUR LE DEV : On commente cette vérification pour voir l'intro à chaque reload
    /*
    const hasEntered = sessionStorage.getItem("hasEntered");
    if (hasEntered === "true") {
      setCurrentState('EXPERIENCE_RUNNING');
      return;
    }
    */

    window.scrollTo(0, 0);

    if (pathname !== "/") {
        document.body.style.overflow = '';
        setAssetsLoaded(true);
        setCurrentState('EXPERIENCE_RUNNING');
        return;
    }

    document.body.style.overflow = 'hidden';

    // Strict Text Requirement
    // setLoaderText("Preparing the experience.");

    // Start State 0 logic
    setCurrentState('LOADING_ASSETS');

    // Fallback/Simulated Loading: Since Scene might be removed or fast
    // We ensure assetsLoaded becomes true eventually to prevent hanging
    const timer = setTimeout(() => {
        setAssetsLoaded(true);
    }, 500); // 0.5s simulated load time

    return () => clearTimeout(timer);

  }, []);

  // Bypass asset loading on non-home pages
  useEffect(() => {
    if (pathname !== "/" && !assetsLoaded) {
      const t = setTimeout(() => setAssetsLoaded(true), 0);
      return () => clearTimeout(t);
    }
  }, [pathname, assetsLoaded]);

  // 2. ORCHESTRATION DES ETATS (State Machine Logic)
  useGSAP(() => {
    // STATE 0: LOADING_ASSETS
    if (currentState === 'LOADING_ASSETS') {
        document.body.style.cursor = 'default';
        
        // Use a simple timeline for the "Preparing" text or visual
        // We will do a clean counter or bar
        gsap.to(".loader-progress", {
            scaleX: 0.9, // Go to 90% while loading
            duration: 2.0,
            ease: "power2.out"
        });
    }
  }, [currentState]);

  // Surveiller assetsLoaded
  useEffect(() => {
    // Wait for BOTH assetsLoaded AND isAudioInitialized
    if (currentState === 'LOADING_ASSETS' && assetsLoaded && isAudioInitialized) {
        // Complete loading bar to 100%
        gsap.to(".loader-progress", {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                 // Fade out loader UI then switch state
                 gsap.to(".loader-wrapper", {
                    opacity: 0,
                    y: -20,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => setCurrentState('INTRO_TEXT')
                });
            }
        });
    }
  }, [currentState, assetsLoaded, isAudioInitialized]);

  useGSAP(() => {
    // STATE 1: INTRO_TEXT
    if (currentState === 'INTRO_TEXT') {
        // 1. Initial State: Hidden
        gsap.set(".intro-logo-anim", { y: 20, opacity: 0 });
        gsap.set(".intro-text-anim", { y: 30, opacity: 0 });
        gsap.set(".intro-button-anim", { y: 20, opacity: 0 });
        
        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentState('INTRO_READY');
            }
        });

        // 2. Staggered Reveal
        tl.to(".intro-logo-anim", {
            y: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out"
        })
        .to(".intro-text-anim", {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.8")
        .to({}, { duration: 0.2 }); // Short pause before button
    }

    // STATE 2: INTRO_READY
    if (currentState === 'INTRO_READY') {
        document.body.style.cursor = 'none';
        
        // Button Reveal (Slide Up + Fade)
        gsap.to(".intro-button-anim", { 
            opacity: 1, 
            y: 0, 
            duration: 1.0, 
            ease: "power3.out"
        });
    }

    // STATE 3: INK_MORPH_REVEAL handled by Effect below (handleEnter triggers transition)
    // We don't need GSAP logic here because handleEnter sets 'isExiting' state which triggers CSS transitions
    // and then sets currentState to INK_MORPH_REVEAL which mounts the InkReveal component.

    // STATE 4: EXPERIENCE_RUNNING
    if (currentState === 'EXPERIENCE_RUNNING') {
        document.body.style.overflow = '';
        gsap.set(introOverlayRef.current, { display: "none" });
        sessionStorage.setItem("hasEntered", "true");
    }

  }, [currentState]);

  // 3. EVENT HANDLERS
  const handleEnter = () => {
    if (currentState !== 'INTRO_READY') return;
    
    // Initialize audio on interaction (Backup if onPointerDown missed)
    initAudio();

    // 1. Play Sound IMMEDIATELY (Before any state updates/repaints)
    playSound("click");

    // 2. Trigger Exit Animations
    setIsExiting(true);

    // 3. Wait for exit animations to complete before triggering InkReveal
    // Text/Button fade out takes ~0.5s. We want the curtain to rise *after* or *as* they finish.
    setTimeout(() => {
        // Trigger InkReveal (Curtain Effect)
        setCurrentState('INK_MORPH_REVEAL');
    }, 500); // Short delay to let decorative lines fade out
  };

  // --- LOGIQUE TRANSITION PAGE (Inchangée mais connectée au contexte) ---
  const getTransitionText = (current: string, target: string) => {
    // Normalizing paths
    const curr = current.replace(/\/$/, "") || "/";
    const next = target.replace(/\/$/, "") || "/";

    // 1. HOME INTEGRATION (Source Narrative)
    // HOME -> PAGES
    if (curr === "/") {
        if (next === "/about" || next === "/studio") return t('narrative.home_about');
        if (next === "/work") return t('narrative.home_work');
        if (next === "/vision" || next === "/expertise") return t('narrative.home_vision');
        if (next === "/contact") return t('narrative.home_contact');
    }

    // PAGES -> HOME
    if (next === "/") {
        if (curr === "/about" || curr === "/studio") return t('narrative.back_home');
        if (curr === "/work") return t('narrative.back_home'); // Or specific if available
        if (curr === "/vision" || curr === "/expertise") return t('narrative.back_home');
        if (curr === "/contact") return t('narrative.back_home');
    }

    // 2. INTER-PAGE NARRATIVE MATRIX
    // FROM ABOUT
    if (curr === "/studio" || curr === "/about") {
        if (next === "/work") return t('narrative.home_work'); // Fallback to generic or add specific keys later
        if (next === "/expertise" || next === "/vision") return t('narrative.home_vision');
        if (next === "/contact") return t('narrative.home_contact');
    }

    // FROM WORK
    if (curr === "/work") {
        if (next === "/studio" || next === "/about") return t('narrative.home_about');
        if (next === "/expertise" || next === "/vision") return t('narrative.home_vision');
        if (next === "/contact") return t('narrative.home_contact');
    }

    // FROM VISION
    if (curr === "/expertise" || curr === "/vision") {
        if (next === "/work") return t('narrative.home_work');
        if (next === "/studio" || next === "/about") return t('narrative.home_about');
        if (next === "/contact") return t('narrative.home_contact');
    }

    // FROM CONTACT
    if (curr === "/contact") {
        if (next === "/studio" || next === "/about") return t('narrative.home_about');
        if (next === "/work") return t('narrative.home_work');
        if (next === "/expertise" || next === "/vision") return t('narrative.home_vision');
    }

    // 3. FALLBACK
    return t('narrative.default');
  };

  const navigate = (href: string) => {
    if (isAnimating || href === pathname) return;

    // Ensure audio is initialized on navigation click
    initAudio();

    const text = getTransitionText(pathname, href);
    setTransitionText(text);
    setIsAnimating(true);
    
    // Sound Trigger (Transition Pulse)
    // Timing exact: Au moment où la phrase apparaît
    playSound("click");

    // DELAY BEFORE TRANSITION STARTS (For calm effect)
    setTimeout(() => {
        const tl = gsap.timeline({
        onComplete: () => {
            router.push(href);
            // Wait for next page to mount before animating out
            setTimeout(() => {
                animateOut();
            }, 300); // Increased mount wait (was 100)
        }
        });

        // ENTER ANIMATION
        tl.set(overlayRef.current, { zIndex: 9999, autoAlpha: 1 })
        .fromTo(overlayRef.current, 
            { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }, 
            { 
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", 
            duration: 1.5, // Slower (was 0.8)
            ease: "power2.inOut" // Smoother ease
            }
        )
        .fromTo(textRef.current,
            { y: 15, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, // Slower text (was 0.4)
            "-=0.8"
        )
        .to({}, { duration: 1.0 }); // Stay longer on text (was 1.4, but total time is longer now)
    }, 800); // 0.8s delay after sound
  };

  const animateOut = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        gsap.set(overlayRef.current, { autoAlpha: 0 }); 
      }
    });

    // EXIT ANIMATION
    tl.to(textRef.current, { 
        y: -10, 
        opacity: 0, 
        duration: 0.6, // Slower fade out (was 0.4)
        ease: "power2.in" 
      })
      .to(overlayRef.current, 
        { 
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)", 
          duration: 1.5, // Slower exit (was 0.8)
          ease: "power2.inOut" // Smoother ease
        },
        "-=0.2"
      );
  };

  return (
    <TransitionContext.Provider value={{ navigate, currentState, setAssetsLoaded }}>
      {children}
      
      {/* --- INTRO OVERLAY (STATE DRIVEN) --- */}
      {currentState !== 'EXPERIENCE_RUNNING' && (
          <div 
            ref={introOverlayRef}
            className="fixed inset-0 w-full h-full z-[10000]"
          >
            <InkReveal 
                reveal={currentState === 'INK_MORPH_REVEAL'} 
                onComplete={() => setCurrentState('EXPERIENCE_RUNNING')}
            >
                {/* DECORATIVE ELEMENTS (Inside the single InkReveal container) */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-8 md:h-12 bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`} />
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-8 md:h-12 bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`} />
                    <div className={`absolute top-1/2 left-0 -translate-y-1/2 w-8 md:w-12 h-[1px] bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`} />
                    <div className={`absolute top-1/2 right-0 -translate-y-1/2 w-8 md:w-12 h-[1px] bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`} />
                    
                    {/* Corner accents (Updated to variable length and safe zone) */}
                    {/* TL */}
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        top: 'var(--corner-safe-zone)', 
                        left: 'var(--corner-safe-zone)',
                        width: 'var(--corner-length)',
                        height: '1px'
                      }}
                    />
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        top: 'var(--corner-safe-zone)', 
                        left: 'var(--corner-safe-zone)',
                        width: '1px',
                        height: 'var(--corner-length)'
                      }}
                    />
                    
                    {/* TR */}
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        top: 'var(--corner-safe-zone)', 
                        right: 'var(--corner-safe-zone)',
                        width: 'var(--corner-length)',
                        height: '1px'
                      }}
                    />
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        top: 'var(--corner-safe-zone)', 
                        right: 'var(--corner-safe-zone)',
                        width: '1px',
                        height: 'var(--corner-length)'
                      }}
                    />
                    
                    {/* BL */}
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        bottom: 'var(--corner-safe-zone)', 
                        left: 'var(--corner-safe-zone)',
                        width: 'var(--corner-length)',
                        height: '1px'
                      }}
                    />
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        bottom: 'var(--corner-safe-zone)', 
                        left: 'var(--corner-safe-zone)',
                        width: '1px',
                        height: 'var(--corner-length)'
                      }}
                    />
                    
                    {/* BR */}
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        bottom: 'var(--corner-safe-zone)', 
                        right: 'var(--corner-safe-zone)',
                        width: 'var(--corner-length)',
                        height: '1px'
                      }}
                    />
                    <div 
                      className={`absolute bg-[#4E2A2A]/20 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
                      style={{ 
                        bottom: 'var(--corner-safe-zone)', 
                        right: 'var(--corner-safe-zone)',
                        width: '1px',
                        height: 'var(--corner-length)'
                      }}
                    />
                </div>

                {/* CONTENT (Centered inside InkReveal) */}
                <div className="relative w-full h-full z-10 min-h-[200px]">
                    
                    {/* A. MOBILE LAYOUT (Optimized for small screens) */}
                    <div className="md:hidden w-full h-full flex flex-col items-center justify-center gap-8">
                        {/* STATE 0: LOADER */}
                        {currentState === 'LOADING_ASSETS' && (
                            <div className="loader-wrapper flex flex-col items-center">
                                <p className="font-sans text-xs uppercase tracking-[0.3em] text-[#4E2A2A]/60 mb-6 font-medium text-center">
                                    {t('loading')}
                                </p>
                                <div className="w-24 h-[2px] bg-[#4E2A2A]/10 overflow-hidden">
                                    <div className="loader-progress w-full h-full bg-[#4E2A2A] origin-left scale-x-0" />
                                </div>
                            </div>
                        )}

                        {/* STATE 1-3: INTRO TEXT */}
                        {(currentState === 'INTRO_TEXT' || currentState === 'INTRO_READY' || currentState === 'INK_MORPH_REVEAL') && (
                            <div 
                                className="intro-element intro-text-anim text-center px-6 flex flex-col items-center gap-4"
                            >
                                <Logo className="text-[#4E2A2A] text-3xl mb-2" />
                                <p className="text-[#4E2A2A] text-4xl font-serif tracking-tight leading-[1.1]">
                                    {t('intro')}
                                </p>
                            </div>
                        )}

                        {/* STATE 2: BUTTON */}
                        {(currentState === 'INTRO_TEXT' || currentState === 'INTRO_READY' || currentState === 'INK_MORPH_REVEAL') && (
                            <button
                                onClick={handleEnter}
                                onPointerDown={() => initAudio()}
                                className={`intro-element intro-button-anim group relative mt-8 py-4 px-8 text-xs uppercase tracking-[0.3em] text-[#4E2A2A]/60 hover:text-[#4E2A2A] transition-colors duration-500 font-medium cursor-none ${
                                    currentState === 'INTRO_READY' ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ pointerEvents: currentState === 'INTRO_READY' ? 'auto' : 'none' }}
                            >
                                {t('enter')}
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#4E2A2A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center" />
                            </button>
                        )}
                    </div>

                    {/* B. DESKTOP LAYOUT (Original Premium Layout) */}
                    <div className="hidden md:flex w-full h-full flex-col items-center justify-center">
                         {/* STATE 0: LOADER */}
                        {currentState === 'LOADING_ASSETS' && (
                            <div className="loader-wrapper absolute flex flex-col items-center">
                                <p className="font-sans text-xs uppercase tracking-[0.4em] text-[#4E2A2A]/60 mb-8 font-medium">
                                    {t('loading')}
                                </p>
                                <div className="w-32 h-[2px] bg-[#4E2A2A]/10 overflow-hidden">
                                    <div className="loader-progress w-full h-full bg-[#4E2A2A] origin-left scale-x-0" />
                                </div>
                            </div>
                        )}

                        {/* STATE 1-3: INTRO TEXT */}
                        {(currentState === 'INTRO_TEXT' || currentState === 'INTRO_READY' || currentState === 'INK_MORPH_REVEAL') && (
                            <div className="flex flex-col items-center gap-8">
                                <div className="intro-element intro-logo-anim">
                                    <Logo className="text-[#4E2A2A] text-5xl" />
                                </div>
                                <div className="intro-element intro-text-anim text-center px-4">
                                    <p className="text-[#4E2A2A] text-7xl font-serif tracking-tight leading-tight">
                                        {t('intro')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* STATE 2: BUTTON */}
                        {(currentState === 'INTRO_TEXT' || currentState === 'INTRO_READY' || currentState === 'INK_MORPH_REVEAL') && (
                            <button
                                onClick={handleEnter}
                                onPointerDown={() => initAudio()}
                                className={`intro-element intro-button-anim group relative mt-16 py-6 px-12 text-sm uppercase tracking-[0.4em] text-[#4E2A2A]/60 hover:text-[#4E2A2A] transition-colors duration-500 ease-in-out font-medium cursor-none -translate-y-8 ${
                                    currentState === 'INTRO_READY' ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{ pointerEvents: currentState === 'INTRO_READY' ? 'auto' : 'none' }}
                            >
                                {t('enter')}
                                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#4E2A2A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-center" />
                            </button>
                        )}
                    </div>
                </div>
            </InkReveal>
          </div>
      )}

      {/* --- PAGE TRANSITION OVERLAY --- */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 w-full h-full bg-[#2A1C15] z-[9999] pointer-events-none invisible"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <p 
            ref={textRef}
            className="text-[#FAF9F6] text-2xl md:text-4xl font-serif tracking-wide text-center px-8 opacity-0 translate-y-4"
          >
            {transitionText}
          </p>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
}
