import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations('HomePage.CTA');

  return (
    <section id="section-cta" className="h-screen flex flex-col justify-center items-center px-8 text-center">
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-8">{t('label')}</h2>
      <p className="text-5xl md:text-8xl font-serif leading-tight mb-8">
        {t('title')}
      </p>
      <p className="text-xl text-muted max-w-2xl mb-12 whitespace-pre-line">
        {t('text')}
      </p>
      <Link 
        href="/contact" 
        className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-transparent px-8 font-medium text-white transition-all duration-300 hover:bg-white hover:text-black hover:w-64 w-48"
      >
        <span className="mr-2">{t('button')}</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </section>
  );
}
