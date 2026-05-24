import { useTranslations } from "next-intl";
import Link from "next/link";
import TransitionLink from "../ui/TransitionLink";
import SoundToggle from "../ui/SoundToggle";
import Logo from "../ui/Logo";

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full py-12 px-8 md:px-24 border-t border-[#FAF9F6]/10 relative z-10 bg-[#2A1C15] text-[#FAF9F6] content-offset">
      <div className="max-w-7xl mx-auto mb-10 md:mb-16">
        <TransitionLink href="/" className="inline-block hover:opacity-70 transition-opacity">
          <Logo className="text-3xl md:text-5xl" />
        </TransitionLink>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-8">
        
        {/* COL 1: LOCATION */}
        <div className="flex flex-col gap-2">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-1">{t('location')}</h4>
            <p className="text-base font-serif">29 rue Tronchet,<br/>75008 Paris</p>
            <p className="text-xs text-[#FAF9F6]/60 font-light">{t('based_in')}</p>
        </div>

        {/* COL 2: CONTACT */}
        <div className="flex flex-col gap-2">
             <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-1">{t('contact')}</h4>
             <a href="mailto:hello@genesisconnectstudio.com" className="text-base font-serif hover:text-[#D4AF37] transition-colors">hello@genesisconnectstudio.com</a>
             <p className="text-xs text-[#FAF9F6]/60 font-light">+33 1 23 45 67 89</p>
        </div>

        {/* COL 3: SOCIALS & LEGAL */}
        <div className="flex flex-col gap-4">
             <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#FAF9F6]/40 mb-1">{t('connect')}</h4>
             <div className="flex gap-6 text-xs uppercase tracking-widest text-[#FAF9F6]/60">
                <Link href="https://linkedin.com" target="_blank" className="hover:text-[#FAF9F6] transition-colors">LinkedIn</Link>
                <Link href="https://instagram.com" target="_blank" className="hover:text-[#FAF9F6] transition-colors">Instagram</Link>
                <TransitionLink href="/legal" className="hover:text-[#FAF9F6] transition-colors">{t('legal')}</TransitionLink>
             </div>
        </div>
      </div>

      {/* BOTTOM: COPYRIGHT + SOUND */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#FAF9F6]/10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
         <p className="text-[#FAF9F6]/40 text-[10px] uppercase tracking-widest order-2 md:order-1">
            {t('copyright')}
         </p>
         <div className="order-1 md:order-2">
            <SoundToggle />
         </div>
      </div>
    </footer>
  );
}
