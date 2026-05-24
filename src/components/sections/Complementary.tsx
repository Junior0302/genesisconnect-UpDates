import { useTranslations } from "next-intl";

export default function Complementary() {
  const t = useTranslations('HomePage.Complementary');

  return (
    <section id="section-complementary" className="h-[50vh] flex flex-col justify-center items-center px-8 text-center">
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-12">{t('title')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 max-w-5xl mx-auto">
        <span className="text-lg md:text-xl font-serif">{t('items.brand')}</span>
        <span className="text-lg md:text-xl font-serif">{t('items.video')}</span>
        <span className="text-lg md:text-xl font-serif">{t('items.assets')}</span>
        <span className="text-lg md:text-xl font-serif">{t('items.redesign')}</span>
      </div>
    </section>
  );
}
