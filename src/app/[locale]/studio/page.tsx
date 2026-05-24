"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StudioPage() {
  const t = useTranslations('StudioPage');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO REVEAL (Initial Load)
      const tl = gsap.timeline();
      tl.from(".hero-title", {
        y: 80,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2,
      })
      .from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      }, "-=1.0");

      // 2. SCROLL REVEALS
      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.fromTo(el, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            }
          }
        );
      });

      // 3. PHILOSOPHY GRID STAGGER
      gsap.fromTo(".philosophy-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".philosophy-grid",
            start: "top 80%",
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#2A1C15] text-[#FAF9F6] overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-[100svh] flex flex-col justify-center items-center content-offset pr-6 md:px-12 pt-20 pb-0">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.9] mb-4 md:mb-6 tracking-tight mix-blend-difference text-[#FAF9F6] whitespace-pre-line">
                {t('Hero.title')}
            </h1>
            <div className="hero-desc w-full md:w-2/3 lg:w-1/2 backdrop-blur-sm md:backdrop-blur-none bg-[#2A1C15]/10 md:bg-transparent py-2">
                <p className="text-sm md:text-2xl font-serif text-[#FAF9F6] mb-2 md:mb-5 leading-tight">
                    {t('Hero.subtitle')}
                </p>
                <p className="text-xs md:text-lg font-light text-[#FAF9F6]/60 leading-relaxed max-w-xl">
                    {t('Hero.description')}
                </p>
            </div>
        </div>
      </section>

      {/* 2. PURPOSE (CENTERED) */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-8 py-24 bg-[#251812]">
        <div className="reveal-text max-w-4xl">
             <h2 className="text-xs uppercase tracking-[0.4em] mb-12 text-[#FAF9F6]/40">{t('Purpose.title')}</h2>
             <p className="text-2xl md:text-4xl font-serif text-[#FAF9F6] leading-tight mb-12">
               {t('Purpose.heading')}
               <br />
               <span className="italic opacity-60 mt-4 block">{t('Purpose.sub1')}</span>
               <span className="italic opacity-60 mt-2 block">{t('Purpose.sub2')}</span>
             </p>
             <p className="text-lg font-light text-[#FAF9F6]/70 max-w-2xl mx-auto leading-relaxed">
                {t('Purpose.text')}
             </p>
        </div>
      </section>

      {/* 3. GLOBAL LOCATION */}
      <section className="min-h-[60vh] flex items-center px-8 md:px-24 py-24">
        <div className="reveal-text flex flex-col md:flex-row gap-12 md:items-baseline">
            <div className="md:w-1/3">
                <h2 className="text-4xl md:text-6xl font-serif leading-tight">
                    {t.rich('GlobalLocation.heading', {
                      br: () => <br/>
                    })}
                </h2>
            </div>
            <div className="md:w-2/3 md:pl-24">
                <p className="text-lg md:text-xl font-light text-[#FAF9F6]/80 leading-relaxed mb-8">
                    {t('GlobalLocation.text')}
                </p>
                <div className="flex flex-col gap-2">
                    <p className="text-2xl font-serif italic text-[#FAF9F6]/60">{t('GlobalLocation.sub1')}</p>
                    <p className="text-2xl font-serif italic text-[#FAF9F6]/60">{t('GlobalLocation.sub2')}</p>
                </div>
            </div>
        </div>
      </section>

      {/* 4. PHILOSOPHY GRID */}
      <section className="min-h-screen flex flex-col justify-center content-offset px-8 md:px-24 py-24 bg-[#251812]">
        <h2 className="reveal-text text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-20 border-b border-[#FAF9F6]/10 pb-4 inline-block">
            {t('Philosophy.title')}
        </h2>
        
        <div className="philosophy-grid grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24">
            
            {/* ITEM 1 */}
            <div className="philosophy-item flex flex-col gap-6">
                <span className="text-sm font-sans tracking-widest opacity-30">01</span>
                <h3 className="text-3xl md:text-4xl font-serif text-[#FAF9F6]">{t('Philosophy.Item1.title')}</h3>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed whitespace-pre-line">
                    {t('Philosophy.Item1.text')}
                </p>
            </div>

            {/* ITEM 2 */}
            <div className="philosophy-item flex flex-col gap-6">
                <span className="text-sm font-sans tracking-widest opacity-30">02</span>
                <h3 className="text-3xl md:text-4xl font-serif text-[#FAF9F6]">{t('Philosophy.Item2.title')}</h3>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed">
                    {t('Philosophy.Item2.text')}
                </p>
            </div>

            {/* ITEM 3 */}
            <div className="philosophy-item flex flex-col gap-6">
                <span className="text-sm font-sans tracking-widest opacity-30">03</span>
                <h3 className="text-3xl md:text-4xl font-serif text-[#FAF9F6]">{t('Philosophy.Item3.title')}</h3>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed">
                    {t.rich('Philosophy.Item3.text', {
                      br: () => <br/>
                    })}
                </p>
            </div>

        </div>
      </section>

      {/* 5. COMMITMENT */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center text-center px-8 py-24">
        <div className="reveal-text max-w-4xl">
             <h2 className="text-xs uppercase tracking-[0.4em] mb-12 text-[#FAF9F6]/40">{t('Commitment.title')}</h2>
             <p className="text-2xl md:text-4xl font-light text-[#FAF9F6]/80 leading-relaxed mb-16">
               {t('Commitment.text')}
             </p>
             <div className="flex flex-col gap-4">
                 <p className="text-4xl md:text-6xl font-serif text-[#FAF9F6]">{t('Commitment.statement1')}</p>
                 <p className="text-4xl md:text-6xl font-serif text-[#D4AF37] italic">{t('Commitment.statement2')}</p>
             </div>
        </div>
      </section>

      {/* SPACER FOR FOOTER */}
      <div className="h-[10vh]"></div>

    </div>
  );
}