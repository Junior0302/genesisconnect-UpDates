"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
// import Scene from "@/components/three/Scene";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSoundContext } from "@/context/SoundContext";
import TransitionLink from "@/components/ui/TransitionLink";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const t = useTranslations('HomePage');
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO ANIMATION (Initial Load)
      const tl = gsap.timeline();
      tl.from(".hero-text-1", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5,
      })
      .from(".hero-text-2", {
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      }, "-=1.0");

      // 2. SCROLL ANIMATIONS (Fade Up)
      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.fromTo(el, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%", // Trigger when top of element hits 85% of viewport height
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // 3. EXPERTISE LIST (Stagger)
      gsap.fromTo(".expertise-item",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".expertise-list",
            start: "top 80%",
          }
        }
      );

      // 4. HORIZONTAL SCROLL GALLERY
      // This pins the section and moves the track horizontally
      const gallerySection = document.querySelector(".gallery-section");
      const galleryTrack = document.querySelector(".gallery-track");
      
      if (gallerySection && galleryTrack) {
        // Calculate the total scroll distance: width of track - width of viewport
        const getScrollAmount = () => -(galleryTrack.scrollWidth - window.innerWidth);
        
        gsap.to(galleryTrack, {
          x: getScrollAmount,
          ease: "none", // Linear movement is essential for scroll-driven animation
          scrollTrigger: {
            trigger: gallerySection,
            start: "top top", // Start pinning when top of section hits top of viewport
            end: () => `+=${galleryTrack.scrollWidth - window.innerWidth}`, // Scroll for the length of the track
            pin: true, // Pin the section
            scrub: 1, // Smooth scrubbing (1s delay) to make it feel heavy/premium
            invalidateOnRefresh: true, // Recalculate on resize
          }
        });

        // Add Skew Effect based on velocity
        ScrollTrigger.create({
          trigger: gallerySection,
          start: "top top",
          end: () => `+=${galleryTrack.scrollWidth - window.innerWidth}`,
          onUpdate: (self) => {
            const velocity = self.getVelocity();
            // Subtle skew based on scroll speed (clamped to avoid distortion)
            const skew = Math.max(Math.min(velocity / 500, 5), -5);
            gsap.to(galleryTrack, { 
              skewX: skew, 
              overwrite: "auto", 
              duration: 0.5, 
              ease: "power3.out" 
            });
          }
        });
      }

    // Use containerRef explicitly for scoping
    }, containerRef);

    // Clean up ScrollTrigger instances specifically
    return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
        ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-transparent">
      {/* 
        LAYER 1: CANVAS (Home Only)
        The Model lives in layout.tsx but is controlled by pathname.
      */}
      {/* <div className="fixed top-0 left-0 w-full h-screen z-10 pointer-events-none">
        <Scene />
      </div> */}

      {/* 
        LAYER 2: SCROLL CONTENT (z-index mixed) 
        We use z-index on sections to decide if they are Front or Back relative to Canvas (z-10).
      */}
      <div className="relative w-full">
        
        {/* 1. HERO (FRONT -> z-20) */}
        <section className="relative z-20 min-h-[100svh] flex flex-col justify-center items-center content-offset pr-6 md:px-12 pt-24 pb-0">
          <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
            <h1 className="hero-text-1 text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.9] mb-6 text-[#FAF9F6] mix-blend-difference tracking-tight whitespace-pre-line">
               {t('Hero.title')}
             </h1>
             <div className="hero-text-2 w-full md:w-2/3 lg:w-1/2 backdrop-blur-sm md:backdrop-blur-none bg-[#2A1C15]/10 md:bg-transparent py-2">
                 <p className="text-base md:text-2xl font-serif text-[#FAF9F6] mb-2 md:mb-5">
                     {t('Hero.subtitle')}
                 </p>
                <p className="text-sm md:text-lg font-light tracking-wide max-w-xl text-[#FAF9F6]/80 mb-4 md:mb-6">
                    {t('Hero.tagline')}
                </p>
                <div className="flex flex-col gap-6">
                    <p className="text-xs md:text-base font-light tracking-wide max-w-2xl text-[#FAF9F6]/60 leading-relaxed">
                        {t('Hero.description')}
                    </p>
                    {/* CTA Button */}
                    <div className="mt-2">
                        <TransitionLink 
                            href="/contact" 
                            className="inline-flex items-center gap-3 text-[#FAF9F6] border border-[#FAF9F6]/30 px-8 py-2 rounded-full hover:bg-[#FAF9F6] hover:text-[#2A1C15] transition-all duration-500 group"
                        >
                            <span className="uppercase tracking-widest text-xs font-medium">{t('Hero.cta')}</span>
                            <span className="w-2 h-2 rounded-full bg-[#D4AF37] group-hover:bg-[#2A1C15] transition-colors duration-500"></span>
                        </TransitionLink>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* 2. PURPOSE / PHILOSOPHY (BEHIND -> z-0) */}
        <section className="relative z-0 min-h-screen flex flex-col justify-center items-center text-center px-8 py-32 md:py-48">
           <div className="reveal-text max-w-4xl">
             <h2 className="text-xs uppercase tracking-[0.4em] mb-16 text-[#FAF9F6]/60">{t('Purpose.label')}</h2>
             <p className="text-3xl md:text-5xl font-serif text-[#FAF9F6] leading-tight mb-16">
               {t('Purpose.title')}
               <br />
               <span className="italic opacity-60 mt-6 block">{t('Purpose.span1')}</span>
               <span className="italic opacity-60 mt-4 block">{t('Purpose.span2')}</span>
             </p>
             <p className="text-base md:text-lg font-light text-[#FAF9F6]/70 max-w-3xl mx-auto leading-relaxed">
                {t('Purpose.text')}
             </p>
           </div>
        </section>

        {/* 3. WHAT WE CRAFT (FRONT -> z-20) */}
        <section className="relative z-20 min-h-screen flex flex-col justify-center items-end content-offset px-8 md:px-32 pointer-events-none py-32 md:py-48">
          <div className="reveal-text text-right pointer-events-auto max-w-3xl">
            <h2 className="text-4xl md:text-7xl font-serif text-[#FAF9F6] mb-16 tracking-tighter">
              {t('WhatWeCraft.title')}
            </h2>
            <p className="font-sans text-lg md:text-xl leading-relaxed text-[#FAF9F6]/80 font-light mb-10">
              {t('WhatWeCraft.text1')}
            </p>
            <p className="font-sans text-base md:text-lg leading-relaxed text-[#FAF9F6]/60 font-light">
              {t('WhatWeCraft.text2')}
            </p>
          </div>
        </section>

        {/* 4. IMMERSION (BEHIND -> z-0) */}
        <section className="relative z-0 min-h-screen flex flex-col justify-center items-center text-center px-8 py-32 md:py-48">
          <div className="reveal-text max-w-4xl">
            <h2 className="text-xs uppercase tracking-[0.3em] mb-16 text-[#FAF9F6]/50">
              {t('Immersion.label')}
            </h2>
            <p className="text-3xl md:text-5xl font-serif text-[#FAF9F6] leading-tight mb-16">
              {t('Immersion.title')}<br/>
              <span className="italic text-[#FAF9F6]/60 mt-6 block">{t('Immersion.span')}</span>
            </p>
            <p className="text-base md:text-lg font-light text-[#FAF9F6]/60 max-w-2xl mx-auto leading-relaxed">
              {t('Immersion.text')}
            </p>
          </div>
        </section>

        {/* 5. CORE EXPERTISE (FRONT -> z-20) */}
        <section className="relative z-20 min-h-screen flex flex-col justify-center items-start px-8 md:px-24 py-24">
          <div className="max-w-5xl w-full">
            <h2 className="reveal-text text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/50 mb-16 border-b border-[#FAF9F6]/10 pb-4 inline-block">
              {t('Expertise.label')}
            </h2>
            <ul className="expertise-list space-y-12 w-full">
              {[
                  {
                      title: t('Expertise.items.websites.title'),
                      desc: t('Expertise.items.websites.desc')
                  },
                  {
                      title: t('Expertise.items.platforms.title'),
                      desc: t('Expertise.items.platforms.desc')
                  },
                  {
                      title: t('Expertise.items.performance.title'),
                      desc: t('Expertise.items.performance.desc')
                  }
              ].map((item, i) => (
                <li key={i} className="expertise-item group flex flex-col md:flex-row md:items-baseline justify-between border-b border-[#FAF9F6]/10 py-8 hover:border-[#FAF9F6]/30 transition-colors cursor-none">
                  <div className="md:w-1/2">
                      <div className="flex items-baseline gap-4 mb-4 md:mb-0">
                          <span className="text-sm font-sans tracking-widest opacity-40 group-hover:opacity-100 transition-opacity duration-500">0{i+1}</span>
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#FAF9F6] group-hover:text-[#D4AF37] transition-colors duration-500">{item.title}</h3>
                      </div>
                  </div>
                  <div className="md:w-1/3">
                      <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-sm md:text-base lg:text-lg group-hover:text-[#FAF9F6]/80 transition-colors duration-500">
                          {item.desc}
                      </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SPACER (Breathing room) */}
        <section className="h-[30vh] w-full" />

        {/* 6. SELECTED WORKS INTRO (BEHIND -> z-0) */}
        <section className="relative z-0 min-h-screen flex flex-col justify-center items-center text-center px-8 md:px-16 lg:px-24 py-24">
          <div className="reveal-text max-w-3xl">
            <h2 className="text-xs uppercase tracking-[0.4em] mb-12 text-[#FAF9F6]/50">
              {t('Gallery.section_title')}
            </h2>
            <p className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#FAF9F6] leading-tight mb-12">
              {t('Gallery.main_title')}<br/>
              <span className="italic text-[#FAF9F6]/60 mt-4 block">{t('Gallery.subtitle')}</span>
            </p>
            <p className="text-base md:text-lg font-light text-[#FAF9F6]/60 max-w-xl mx-auto leading-relaxed">
              {t('Gallery.description')}
            </p>
          </div>
        </section>

        {/* 7. IMMERSIVE HORIZONTAL GALLERY (FRONT -> z-20) */}
        {/* Pinned section for horizontal scroll */}
        {/* Update: Break out of content-offset to be full width */}
        <section className="gallery-section relative z-20 h-screen w-[100vw] -ml-[var(--content-start)] overflow-hidden bg-[#2A1C15]">
          <div className="gallery-track flex h-full items-center px-6 md:px-12 lg:px-24 w-max">
            
            {/* Gallery Intro / Spacer */}
            <div className="w-[30vw] md:w-[25vw] lg:w-[20vw] shrink-0 mr-12 md:mr-16 lg:mr-24 flex flex-col justify-center opacity-50">
               <span className="block w-12 h-[1px] bg-[#FAF9F6] mb-4"></span>
               <p className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6] whitespace-pre-line">
                 {t('Gallery.intro')}
               </p>
            </div>

            {/* Project Cards */}
            {[
              { name: t('Gallery.projects.p1.name'), type: t('Gallery.projects.p1.type'), year: "2024", color: "bg-[#3A2C25]" },
              { name: t('Gallery.projects.p2.name'), type: t('Gallery.projects.p2.type'), year: "2023", color: "bg-[#253A30]" },
              { name: t('Gallery.projects.p3.name'), type: t('Gallery.projects.p3.type'), year: "2024", color: "bg-[#252A3A]" },
              { name: t('Gallery.projects.p4.name'), type: t('Gallery.projects.p4.type'), year: "2023", color: "bg-[#3A2525]" },
            ].map((project, i) => (
              <div 
                key={i} 
                className="gallery-item group relative w-[80vw] md:w-[60vw] lg:w-[45vw] h-[60vh] md:h-[60vh] lg:h-[70vh] mr-8 md:mr-12 lg:mr-16 shrink-0 flex flex-col justify-between p-8 md:p-10 lg:p-12 transition-transform duration-500 hover:scale-[1.02]"
                onMouseEnter={() => {
                  // Focus Grain: Interaction Portfolio
                  // Check for non-touch device (hover capability) to avoid mobile trigger
                  if (window.matchMedia('(hover: hover)').matches) {
                    playSound('focus_grain');
                  }
                }}
              >
                {/* Background Placeholder (Image would go here) */}
                <div className={`absolute inset-0 ${project.color} opacity-40 group-hover:opacity-60 transition-opacity duration-700 ease-out border border-[#FAF9F6]/10`}></div>
                
                {/* Content */}
                <div className="relative z-10 flex justify-between items-start">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/50">0{i+1}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/50">{project.year}</span>
                </div>

                <div className="relative z-10">
                  <h3 className="text-5xl md:text-5xl lg:text-7xl font-serif text-[#FAF9F6] mb-4 translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {project.name}
                  </h3>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#FAF9F6]/50 group-hover:text-[#FAF9F6] transition-colors duration-500">
                    {project.type}
                  </p>
                </div>
              </div>
            ))}

            {/* End Spacer */}
            <div className="w-[20vw] shrink-0"></div>

          </div>
        </section>

        {/* 8. CTA (FRONT -> z-20) */}
        <section className="relative z-20 h-screen flex flex-col justify-center items-center text-center px-8">
          <div className="reveal-text max-w-4xl">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#FAF9F6] mb-8">
               {t('CTA.title')}
             </h2>
             <p className="text-lg md:text-xl font-light tracking-wide text-[#FAF9F6]/60 mb-16 max-w-2xl mx-auto whitespace-pre-line">
               {t('CTA.text')}
             </p>
             <div className="group relative inline-block cursor-none">
                <a href="mailto:hello@genesisconnectstudio.com" className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#FAF9F6] hover:text-[#D4AF37] transition-colors duration-500">
                    {t('CTA.button')}
                </a>
                <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-[#FAF9F6]/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             </div>
          </div>
        </section>

        {/* SPACER FOR FOOTER */}
        <section className="h-[20vh] w-full" />
      </div>
    </div>
  );
}
