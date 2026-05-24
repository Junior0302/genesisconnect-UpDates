"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSoundContext } from "@/context/SoundContext";
import { useTranslations } from "next-intl";
import Image from "next/image";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function WorkPage() {
  const t = useTranslations('WorkPage');
  const containerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundContext();

  const projects = [
    {
      id: "01",
      title: t('Projects.Project1.title'),
      category: t('Projects.Project1.category'),
      industry: t('Projects.Project1.industry'),
      desc: t('Projects.Project1.desc'),
      imageSrc: "/images/Image_rideau_effect_ink.png",
      color: "bg-[#3A2C25]"
    },
    {
      id: "02",
      title: t('Projects.Project2.title'),
      category: t('Projects.Project2.category'),
      industry: t('Projects.Project2.industry'),
      desc: t('Projects.Project2.desc'),
      imageSrc: "/images/Image_rideau_effect_ink.png",
      color: "bg-[#253A30]"
    },
    {
      id: "03",
      title: t('Projects.Project3.title'),
      category: t('Projects.Project3.category'),
      industry: t('Projects.Project3.industry'),
      desc: t('Projects.Project3.desc'),
      imageSrc: "/images/Image_rideau_effect_ink.png",
      color: "bg-[#252A3A]"
    },
    {
      id: "04",
      title: t('Projects.Project4.title'),
      category: t('Projects.Project4.category'),
      industry: t('Projects.Project4.industry'),
      desc: t('Projects.Project4.desc'),
      imageSrc: "/images/Image_rideau_effect_ink.png",
      color: "bg-[#3A2525]"
    }
  ];

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

      // 2. PROJECT REVEALS (Staggered)
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((el) => {
        gsap.fromTo(el,  
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            }
          }
        );
      });

      // 3. TEXT REVEALS
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
      
      {/* 1. HERO REVEAL (Initial Load) */}
      <section className="min-h-[100svh] flex flex-col justify-center items-center pr-6 md:px-12 pt-20 pb-0">
        <div className="max-w-7xl w-full mx-auto flex flex-col justify-center h-full">
            <h1 className="hero-title text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.9] mb-4 md:mb-6 tracking-tight mix-blend-difference text-[#FAF9F6]">
                {t.rich('Hero.title', {
                  br: () => <br/>
                })}
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

      {/* 2. PROJECT LIST */}
      <section className="w-full px-8 md:px-24 pb-32">
        <div className="flex flex-col gap-24 md:gap-40">
            {projects.map((project) => (
                <div 
                    key={project.id} 
                    className="project-card group relative w-full flex flex-col md:flex-row gap-8 md:gap-16 items-start"
                    onMouseEnter={() => {
                        if (window.matchMedia('(hover: hover)').matches) {
                          playSound('focus_grain');
                        }
                    }}
                >
                    {/* VISUAL (Left/Right alternating could be cool, but sticking to clean list for now) */}
                    <div className="w-full md:w-2/3 aspect-[16/9] relative overflow-hidden bg-[#1A100C]">
                        <Image
                          src={project.imageSrc}
                          alt={project.title}
                          fill
                          priority={project.id === "01"}
                          sizes="(min-width: 768px) 66vw, 100vw"
                          className="object-cover opacity-80 group-hover:opacity-95 transition-opacity duration-700"
                        />

                        <div
                          className={`absolute inset-0 ${project.color} opacity-25 group-hover:opacity-40 transition-all duration-700 ease-out transform group-hover:scale-105`}
                        ></div>
                        
                        {/* Overlay Content (Optional) */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                             <span className="text-xs uppercase tracking-[0.2em] border border-[#FAF9F6]/20 px-6 py-3 rounded-full backdrop-blur-sm">{t('Projects.viewProject')}</span>
                        </div>
                    </div>

                    {/* INFO (Right side) */}
                    <div className="w-full md:w-1/3 flex flex-col h-full justify-between py-2">
                        <div>
                            <span className="text-xs font-sans tracking-widest opacity-40 mb-4 block">{project.id}</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-[#FAF9F6] mb-2 group-hover:text-[#D4AF37] transition-colors duration-500">
                                {project.title}
                            </h2>
                            <div className="flex flex-col gap-1 mb-8">
                                <span className="text-sm uppercase tracking-widest text-[#FAF9F6]/60">{project.category}</span>
                                <span className="text-xs uppercase tracking-widest text-[#FAF9F6]/40">{project.industry}</span>
                            </div>
                            <p className="text-[#FAF9F6]/70 font-light leading-relaxed text-base">
                                {project.desc}
                            </p>
                        </div>
                        
                        {/* Hover Details (Optional) */}
                        <div className="mt-12 pt-8 border-t border-[#FAF9F6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <div className="flex justify-between text-xs uppercase tracking-widest text-[#FAF9F6]/50">
                                <span>{t('Projects.year')}</span>
                                <span>{t('Projects.scope')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* 3. APPROACH / CLOSING */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-8 py-24 bg-[#251812]">
        <div className="reveal-text max-w-4xl">
             <h2 className="text-xs uppercase tracking-[0.4em] mb-12 text-[#FAF9F6]/40">{t('Approach.title')}</h2>
             <div className="flex flex-col gap-4 mb-12">
                 <p className="text-2xl md:text-4xl font-serif text-[#FAF9F6]">{t('Approach.statement1')}</p>
                 <p className="text-2xl md:text-4xl font-serif text-[#FAF9F6] italic opacity-60">{t('Approach.statement2')}</p>
             </div>
             <p className="text-base font-light text-[#FAF9F6]/70 max-w-2xl mx-auto leading-relaxed">
                {t('Approach.text')}
             </p>
        </div>
      </section>

      {/* SPACER FOR FOOTER */}
      <div className="h-[10vh]"></div>

    </div>
  );
}
