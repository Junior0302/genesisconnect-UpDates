"use client";

import { usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TransitionLink from "@/components/ui/TransitionLink";
import Logo from "@/components/ui/Logo";

  export default function Navbar() {
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('Navigation');
    
    const navItems = [
      { name: t('studio'), href: "/studio" },
      { name: t('expertise'), href: "/expertise" },
      { name: t('work'), href: "/work" },
      { name: t('contact'), href: "/contact" },
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const switchLocale = (newLocale: string) => {
      const path = pathname === '/' ? '' : pathname;
      window.location.href = `/${newLocale}${path}`;
    };
  
    // Close mobile menu when route changes
    useEffect(() => {
      if (isOpen) {
        const t = setTimeout(() => setIsOpen(false), 0);
        return () => clearTimeout(t);
      }
    }, [pathname, isOpen]);
  
    // Handle Scroll Effect
    useEffect(() => {
      const handleScroll = () => {
        if (window.scrollY > 20) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };
  
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  // Mobile menu animation
  useGSAP(() => {
    // Logo entrance animation (Removed to prevent visibility issues)
    /*
    gsap.from(".nav-logo", {
      y: -20,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.2
    });
    */

    if (isOpen) {
      // Open animation
      const tl = gsap.timeline();
      
      tl.to(".mobile-menu", {
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power2.out",
      })
      .fromTo(".mobile-menu-bg", 
        { scaleY: 0, transformOrigin: "top" },
        { scaleY: 1, duration: 0.6, ease: "circ.out" },
        "-=0.5"
      )
      .fromTo(
        ".mobile-link",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power3.out" },
        "-=0.3"
      );
    } else {
      // Close animation
      gsap.to(".mobile-menu", {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.4,
        ease: "power2.in",
      });
    }
  }, [isOpen]);

  return (
    <>
      <header 
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) border-b content-offset ${
          isScrolled 
            ? "py-4 px-6 md:px-12 bg-[#2A1C15]/60 backdrop-blur-2xl backdrop-saturate-150 border-[#FAF9F6]/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]" 
            : "py-6 px-6 md:py-8 md:px-12 bg-transparent border-transparent"
        } flex justify-between items-center pointer-events-none`}
      >
        {/* Glass Noise Overlay (Optional - adds texture) */}
        {isScrolled && (
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-[-1]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            ></div>
        )}

        {/* LOGO - Top Left (MOBILE VERSION) */}
        <TransitionLink 
          href="/" 
          className={`md:hidden nav-logo pointer-events-auto transition-all duration-300 relative z-[60] block ${
            isOpen ? "text-[#FAF9F6] opacity-100" : "text-[#FAF9F6] opacity-100"
          }`}
          aria-label="Genesis Connect Home"
        >
          {/* Mobile specific sizing/positioning if needed */}
          <Logo className={`transition-all duration-500 text-xl`} />
        </TransitionLink>

        {/* LOGO - Top Left (DESKTOP VERSION) */}
        <TransitionLink 
          href="/" 
          className="hidden md:block nav-logo pointer-events-auto text-[#FAF9F6] hover:opacity-80 transition-opacity relative z-[60] opacity-100"
          aria-label="Genesis Connect Home"
        >
          <Logo className={`transition-all duration-500 ${isScrolled ? "text-xl" : "text-2xl"}`} />
        </TransitionLink>

        {/* DESKTOP MENU - Top Right */}
        <nav className="hidden md:flex flex-row items-center gap-10 pointer-events-auto">
          {navItems.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className={`group relative text-[#FAF9F6] text-[0.8rem] tracking-[0.2em] uppercase transition-all duration-300 ease-out
                ${pathname === item.href ? "opacity-100 font-medium" : "opacity-70 hover:opacity-100"}
              `}
            >
              {item.name}
              {/* Hover Underline Effect */}
              <span className={`absolute -bottom-2 left-0 w-full h-[1px] bg-[#FAF9F6] origin-left transform transition-transform duration-300 ease-out ${pathname === item.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></span>
              
              {/* Glow Effect on Hover */}
              <span className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full -z-10 scale-150"></span>
            </TransitionLink>
          ))}

          {/* LANGUAGE SWITCHER DESKTOP */}
          <div className="flex gap-3 border-l border-[#FAF9F6]/20 pl-6 ml-2">
            {['fr', 'en', 'zh'].map((l) => (
                <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`text-[0.7rem] uppercase tracking-widest transition-colors ${
                        locale === l ? 'text-[#FAF9F6] font-bold' : 'text-[#FAF9F6]/50 hover:text-[#FAF9F6]'
                    }`}
                >
                    {l === 'zh' ? '中文' : l}
                </button>
            ))}
          </div>
        </nav>

        {/* MOBILE MENU TOGGLE - Top Right */}
        <button
          className={`md:hidden pointer-events-auto transition-all duration-300 z-50 relative group p-2 -mr-2 ${
            isOpen ? "text-[#FAF9F6]" : "text-[#FAF9F6]"
          }`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <div className="relative w-8 h-8 flex items-center justify-center">
             {/* Custom Animated Icon can go here, using standard icons for now but animated */}
             <span className={`absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}>
                <MenuIcon size={28} strokeWidth={1} />
             </span>
             <span className={`absolute transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
                <X size={28} strokeWidth={1} />
             </span>
          </div>
        </button>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div 
        className="mobile-menu fixed inset-0 z-40 flex flex-col items-center justify-center opacity-0 pointer-events-none"
      >
        {/* Background Layer with Blur and Noise */}
        <div className="mobile-menu-bg absolute inset-0 bg-[#2A1C15]/95 backdrop-blur-xl w-full h-full">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            ></div>
        </div>

        {/* Menu Content */}
        <nav className="relative z-10 flex flex-col items-center gap-12">
          {navItems.map((item) => (
            <TransitionLink
              key={item.href}
              href={item.href}
              className="mobile-link group relative text-[#FAF9F6] text-4xl md:text-5xl font-serif tracking-tight opacity-0 hover:text-[#FAF9F6]/80 transition-colors"
            >
              <span className="relative z-10">{item.name}</span>
              {/* Subtle line through on hover for editorial feel */}
              <span className="absolute left-0 top-1/2 w-full h-[1px] bg-[#FAF9F6]/30 -translate-y-1/2 scale-x-0 group-hover:scale-x-110 transition-transform duration-500 ease-expo"></span>
            </TransitionLink>
          ))}

          {/* LANGUAGE SWITCHER MOBILE */}
          <div className="flex gap-6 mt-4">
            {['fr', 'en', 'zh'].map((l) => (
                <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`text-sm uppercase tracking-widest transition-colors ${
                        locale === l ? 'text-[#FAF9F6] font-bold border-b border-[#FAF9F6]' : 'text-[#FAF9F6]/50 hover:text-[#FAF9F6]'
                    }`}
                >
                    {l === 'zh' ? '中文' : l}
                </button>
            ))}
          </div>
        </nav>
        
        {/* Decorative Footer in Menu */}
        <div className="mobile-link absolute bottom-12 flex flex-col items-center gap-2 text-[#FAF9F6]/40 text-[10px] tracking-[0.3em] uppercase opacity-0 font-medium">
            <span>Genesis Connect</span>
            <span className="w-8 h-[1px] bg-[#FAF9F6]/20"></span>
            <span>© 2024</span>
        </div>
      </div>
    </>
  );
}
