"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ExpertisePage() {
  const t = useTranslations('ExpertisePage');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO REVEAL
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

      // 3. LIST STAGGERS
      gsap.utils.toArray<HTMLElement>(".stagger-container").forEach((el) => {
        gsap.fromTo(el.querySelectorAll(".stagger-item"),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#2A1C15] text-[#FAF9F6] overflow-hidden">
      
      {/* 1. HERO / VISION */}
      <section className="min-h-[100svh] flex flex-col justify-center items-center pr-6 md:px-12 pt-20 pb-0">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.9] mb-4 md:mb-6 tracking-tight mix-blend-difference text-[#FAF9F6] whitespace-pre-line">
                {t('Hero.title')}
            </h1>
            <div className="hero-desc w-full md:w-2/3 lg:w-1/2 backdrop-blur-sm md:backdrop-blur-none bg-[#2A1C15]/10 md:bg-transparent py-2">
                <p className="text-sm md:text-2xl font-serif text-[#FAF9F6] mb-2 md:mb-5 leading-tight whitespace-pre-line">
                    {t('Hero.subtitle')}
                </p>
                <div className="space-y-2 md:space-y-4 text-xs md:text-lg font-light text-[#FAF9F6]/60 leading-relaxed max-w-xl">
                    <p>
                        {t('Hero.description')}
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* 2. EXPERTISE INTRO */}
      <section className="min-h-[50vh] flex flex-col justify-center items-center text-center px-8 py-24 bg-[#251812]">
        <div className="reveal-text max-w-4xl">
             <h2 className="text-xs uppercase tracking-[0.4em] mb-12 text-[#FAF9F6]/40">{t('Intro.title')}</h2>
             <p className="text-3xl md:text-5xl font-serif text-[#FAF9F6] leading-tight mb-8">
               {t('Intro.heading')}
             </p>
             <p className="text-lg font-light text-[#FAF9F6]/70 max-w-2xl mx-auto leading-relaxed">
                {t('Intro.text')}
             </p>
        </div>
      </section>

      {/* 3. CORE EXPERTISE */}
      <section className="min-h-screen px-8 md:px-24 py-24">
        <h2 className="reveal-text text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-20 border-b border-[#FAF9F6]/10 pb-4 inline-block">
            {t('CoreExpertise.title')}
        </h2>
        
        <div className="stagger-container grid grid-cols-1 gap-24">
            
            {/* ITEM 1 */}
            <div className="stagger-item group flex flex-col md:flex-row gap-8 md:gap-24 border-b border-[#FAF9F6]/10 pb-16">
                <div className="md:w-1/3">
                    <h3 className="text-4xl md:text-5xl font-serif text-[#FAF9F6] mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
                        {t('CoreExpertise.Item1.title')}
                    </h3>
                </div>
                <div className="md:w-2/3 md:pt-4">
                    <p className="text-xl text-[#FAF9F6]/80 mb-4 font-light">{t('CoreExpertise.Item1.subtitle')}</p>
                    <p className="text-[#FAF9F6]/60 font-light leading-relaxed max-w-2xl">
                        {t('CoreExpertise.Item1.description')}
                    </p>
                </div>
            </div>

            {/* ITEM 2 */}
            <div className="stagger-item group flex flex-col md:flex-row gap-8 md:gap-24 border-b border-[#FAF9F6]/10 pb-16">
                <div className="md:w-1/3">
                    <h3 className="text-4xl md:text-5xl font-serif text-[#FAF9F6] mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
                        {t('CoreExpertise.Item2.title')}
                    </h3>
                </div>
                <div className="md:w-2/3 md:pt-4">
                    <p className="text-xl text-[#FAF9F6]/80 mb-4 font-light">{t('CoreExpertise.Item2.subtitle')}</p>
                    <p className="text-[#FAF9F6]/60 font-light leading-relaxed max-w-2xl">
                        {t('CoreExpertise.Item2.description')}
                    </p>
                </div>
            </div>

            {/* ITEM 3 */}
            <div className="stagger-item group flex flex-col md:flex-row gap-8 md:gap-24 pb-8">
                <div className="md:w-1/3">
                    <h3 className="text-4xl md:text-5xl font-serif text-[#FAF9F6] mb-4 group-hover:text-[#D4AF37] transition-colors duration-500">
                        {t('CoreExpertise.Item3.title')}
                    </h3>
                </div>
                <div className="md:w-2/3 md:pt-4">
                    <p className="text-xl text-[#FAF9F6]/80 mb-4 font-light">{t('CoreExpertise.Item3.subtitle')}</p>
                    <p className="text-[#FAF9F6]/60 font-light leading-relaxed max-w-2xl">
                        {t('CoreExpertise.Item3.description')}
                    </p>
                </div>
            </div>

        </div>
      </section>

      {/* 4. STRATEGIC EVOLUTION */}
      <section className="min-h-[60vh] px-8 md:px-24 py-24 bg-[#251812]">
        <div className="flex flex-col md:flex-row gap-16 md:gap-32">
            <div className="md:w-1/3 reveal-text">
                <h2 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-8 border-b border-[#FAF9F6]/10 pb-4 inline-block">
                    {t('StrategicEvolution.title')}
                </h2>
                <h3 className="text-3xl md:text-4xl font-serif text-[#FAF9F6] mb-6">
                    {t('StrategicEvolution.heading')}
                </h3>
            </div>
            <div className="md:w-2/3 reveal-text md:pt-20">
                <p className="text-xl text-[#FAF9F6]/80 mb-6 font-light">{t('StrategicEvolution.subtitle')}</p>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed max-w-2xl">
                    {t('StrategicEvolution.description')}
                </p>
            </div>
        </div>
      </section>

      {/* 5. COMPLEMENTARY CRAFT */}
      <section className="min-h-screen px-8 md:px-24 py-24">
        <div className="mb-24 reveal-text">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-4 border-b border-[#FAF9F6]/10 pb-4 inline-block">
                {t('ComplementaryCraft.title')}
            </h2>
            <p className="text-sm uppercase tracking-widest text-[#FAF9F6]/40">
                {t('ComplementaryCraft.subtitle')}
            </p>
        </div>

        <div className="stagger-container grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            
            <div className="stagger-item">
                <h3 className="text-2xl font-serif text-[#FAF9F6] mb-6">{t('ComplementaryCraft.Items.VisualAssets.title')}</h3>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed">
                    {t('ComplementaryCraft.Items.VisualAssets.description')}
                </p>
            </div>

            <div className="stagger-item">
                <h3 className="text-2xl font-serif text-[#FAF9F6] mb-6">{t('ComplementaryCraft.Items.BrandIdentity.title')}</h3>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed">
                    {t('ComplementaryCraft.Items.BrandIdentity.description')}
                </p>
            </div>

            <div className="stagger-item">
                <h3 className="text-2xl font-serif text-[#FAF9F6] mb-6">{t('ComplementaryCraft.Items.VideoMotion.title')}</h3>
                <p className="text-[#FAF9F6]/60 font-light leading-relaxed">
                    {t('ComplementaryCraft.Items.VideoMotion.description')}
                </p>
            </div>

        </div>
      </section>

      {/* SPACER FOR FOOTER */}
      <div className="h-[10vh]"></div>

    </div>
  );
}