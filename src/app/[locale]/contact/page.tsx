"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSoundContext } from "@/context/SoundContext";
import { useTranslations } from "next-intl";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactPage() {
  const t = useTranslations('ContactPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundContext();

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
        delay: 0.1,
      }, "-=1.0");

      // 2. INFO SECTIONS REVEAL
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
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#2A1C15] text-[#FAF9F6] overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center px-6 md:px-12 pt-24 pb-0">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
                <div className="lg:col-span-7">
                    <h1 className="hero-title text-[10vw] md:text-[8vw] lg:text-[6vw] font-serif leading-[0.85] tracking-tight mix-blend-difference text-[#FAF9F6] whitespace-pre-line">
                        {t('Hero.title')}
                    </h1>
                </div>

                <div className="lg:col-span-5 relative mt-12 lg:mt-24">
                    <div className="hero-desc relative pl-8 md:pl-12">
                        <p className="text-lg md:text-2xl font-serif text-[#FAF9F6] mb-12 leading-tight whitespace-pre-line">
                            {t('Hero.subtitle')}
                        </p>
                        <p className="text-sm md:text-base font-light text-[#FAF9F6]/60 leading-relaxed max-w-xl whitespace-pre-line">
                            {t('Hero.description')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. CONTACT DETAILS */}
      <section className="w-full px-8 md:px-24 pb-32">
        <div className="max-w-7xl mx-auto border-t border-[#FAF9F6]/10 pt-24">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                
                {/* LEFT COLUMN: PHILOSOPHY */}
                <div className="reveal-text">
                    <h2 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-12 border-b border-[#FAF9F6]/10 pb-4 inline-block">
                        {t('Collaboration.title')}
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-serif text-[#FAF9F6] mb-8">
                        {t('Collaboration.heading')}
                    </h3>
                    <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-base mb-8 max-w-xl">
                        {t('Collaboration.text1')}
                    </p>
                    <p className="text-[#FAF9F6]/60 font-light leading-relaxed text-lg max-w-xl">
                        {t('Collaboration.text2')}
                    </p>
                </div>

                {/* RIGHT COLUMN: CONTACT INFO */}
                <div className="flex flex-col gap-16 reveal-text md:pt-4">
                    
                    {/* EMAIL & PHONE */}
                    <div>
                        <h3 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-8">{t('DirectContact.title')}</h3>
                        <div className="flex flex-col gap-6">
                            <a 
                                href="mailto:hello@genesisconnectstudio.com" 
                                className="text-3xl md:text-5xl font-serif text-[#FAF9F6] hover:text-[#D4AF37] transition-colors duration-300 break-words"
                                onMouseEnter={() => playSound('focus_grain')}
                            >
                                hello@<br className="hidden md:block"/>genesisconnectstudio.com
                            </a>
                            <a 
                                href="tel:+33123456789" 
                                className="text-2xl md:text-3xl font-serif text-[#FAF9F6]/80 hover:text-[#FAF9F6] transition-colors duration-300"
                            >
                                +33 1 23 45 67 89
                            </a>
                        </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                        <h3 className="text-xs uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-8">{t('Location.title')}</h3>
                        <p className="text-3xl md:text-4xl font-serif text-[#FAF9F6] mb-4">
                          {t.rich('Location.address', {
                            br: () => <br/>
                          })}
                        </p>
                        <p className="text-[#FAF9F6]/60 font-light leading-relaxed max-w-sm">
                            {t('Location.description')}
                        </p>
                    </div>

                </div>

            </div>
        </div>
      </section>

      {/* 3. CLOSING STATEMENT */}
      <section className="min-h-[50vh] flex flex-col justify-center items-center text-center px-8 py-24 bg-[#251812]">
        <div className="reveal-text max-w-3xl">
             <p className="text-xs uppercase tracking-widest text-[#FAF9F6]/40 mb-8">{t('Closing.title')}</p>
             <p className="text-2xl md:text-4xl font-serif text-[#FAF9F6] leading-relaxed mb-8">
               {t('Closing.text')}
             </p>
             <p className="text-xl md:text-2xl font-light text-[#FAF9F6]/60 leading-relaxed italic">
                {t('Closing.subtext')}
             </p>
        </div>
      </section>

      {/* SPACER FOR FOOTER */}
      <div className="h-[10vh]"></div>

    </div>
  );
}
