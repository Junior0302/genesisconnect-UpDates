import { useTranslations } from "next-intl";

export default function Immersion() {
  const t = useTranslations('HomePage.Immersion');

  return (
    <section id="section-immersion" className="h-screen flex flex-col justify-center items-center px-8 text-center">
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-8">{t('label')}</h2>
      <p className="text-4xl md:text-6xl font-serif leading-tight max-w-4xl mb-8">
        {t('title')} <br/>
        {t('span')}
      </p>
      <p className="text-xl text-muted max-w-2xl">
        {t('text')}
      </p>
    </section>
  );
}
