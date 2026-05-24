"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSoundContext } from "@/context/SoundContext";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LegalPage() {
  const t = useTranslations('LegalPage');
  const containerRef = useRef<HTMLDivElement>(null);
  // const { playSound } = useSoundContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. HERO REVEAL
      const tl = gsap.timeline();
      tl.from(".hero-title", {
        y: 60,
        opacity: 0,
        duration: 1.0,
        ease: "power3.out",
        delay: 0.1,
      })
      .from(".hero-desc", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0,
      }, "-=0.6");

      // 2. TEXT REVEALS
      gsap.utils.toArray<HTMLElement>(".reveal-text").forEach((el) => {
        gsap.fromTo(el, 
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
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
      <section className="min-h-[50vh] flex flex-col justify-center items-start px-6 md:px-12 pt-24 pb-0">
        <div className="max-w-7xl w-full mx-auto">
            <h1 className="hero-title text-4xl md:text-6xl font-serif leading-[0.9] tracking-tight mix-blend-difference text-[#FAF9F6] mb-12 whitespace-pre-line">
                {t('Hero.title')}
            </h1>
            <div className="hero-desc">
                <p className="text-sm md:text-lg font-light text-[#FAF9F6]/60 leading-relaxed max-w-xl">
                    {t('Hero.description')}
                </p>
            </div>
        </div>
      </section>

      {/* 2. CONTENT */}
      <section className="w-full px-6 md:px-12 pb-32">
        <div className="max-w-4xl mx-auto flex flex-col gap-20">
            
            {/* ARTICLE 1 */}
            <div className="reveal-text">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-6 border-b border-[#FAF9F6]/10 pb-2 inline-block">
                    {t('Articles.Publisher.title')}
                </h2>
                <div className="text-[#FAF9F6]/80 font-light leading-relaxed text-base space-y-4">
                    <p>
                        {t.rich('Articles.Publisher.text1', {
                          strong: (chunks) => <strong>{chunks}</strong>
                        })}
                    </p>
                    <p>
                        {t.rich('Articles.Publisher.text2', {
                          strong: (chunks) => <strong>{chunks}</strong>,
                          br: () => <br/>
                        })}
                    </p>
                    <p>
                        {t.rich('Articles.Publisher.text3', {
                          strong: (chunks) => <strong>{chunks}</strong>,
                          br: () => <br/>
                        })}
                    </p>
                </div>
            </div>

            {/* ARTICLE 2 */}
            <div className="reveal-text">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-6 border-b border-[#FAF9F6]/10 pb-2 inline-block">
                    {t('Articles.Hosting.title')}
                </h2>
                <div className="text-[#FAF9F6]/80 font-light leading-relaxed text-lg space-y-4">
                    <p>
                        {t('Articles.Hosting.text1')}
                    </p>
                    <p>
                        {t.rich('Articles.Hosting.text2', {
                          strong: (chunks) => <strong>{chunks}</strong>,
                          br: () => <br/>,
                          link: (chunks) => <a href="https://vercel.com" target="_blank" className="hover:text-[#D4AF37] transition-colors">{chunks}</a>
                        })}
                    </p>
                </div>
            </div>

            {/* ARTICLE 3 */}
            <div className="reveal-text">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-6 border-b border-[#FAF9F6]/10 pb-2 inline-block">
                    {t('Articles.IntellectualProperty.title')}
                </h2>
                <div className="text-[#FAF9F6]/80 font-light leading-relaxed text-lg space-y-4">
                    <p>
                        {t('Articles.IntellectualProperty.text1')}
                    </p>
                    <p>
                        {t('Articles.IntellectualProperty.text2')}
                    </p>
                </div>
            </div>

            {/* ARTICLE 4 */}
            <div className="reveal-text">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-6 border-b border-[#FAF9F6]/10 pb-2 inline-block">
                    {t('Articles.PersonalData.title')}
                </h2>
                <div className="text-[#FAF9F6]/80 font-light leading-relaxed text-lg space-y-4">
                    <p>
                        {t('Articles.PersonalData.text1')}
                    </p>
                    <p>
                        {t.rich('Articles.PersonalData.text2', {
                          link: (chunks) => <a href="mailto:hello@genesisconnectstudio.com" className="hover:text-[#D4AF37] transition-colors">{chunks}</a>
                        })}
                    </p>
                    <p>
                        {t('Articles.PersonalData.text3')}
                    </p>
                </div>
            </div>

             {/* ARTICLE 5 */}
             <div className="reveal-text">
                <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-6 border-b border-[#FAF9F6]/10 pb-2 inline-block">
                    {t('Articles.Cookies.title')}
                </h2>
                <div className="text-[#FAF9F6]/80 font-light leading-relaxed text-lg space-y-4">
                    <p>
                        {t('Articles.Cookies.text1')}
                    </p>
                    <p>
                        {t('Articles.Cookies.text2')}
                    </p>
                </div>
            </div>

        </div>
      </section>

      {/* SPACER FOR FOOTER */}
      <div className="h-[10vh]"></div>

    </div>
  );
}
