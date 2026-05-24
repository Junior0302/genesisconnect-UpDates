import { useTranslations } from "next-intl";

export default function Intro() {
  const t = useTranslations('HomePage.Purpose');

  return (
    <section id="section-intro" className="h-screen flex flex-col justify-center items-end px-8 md:px-24 max-w-7xl mx-auto text-right">
      <div className="max-w-2xl">
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-8">{t('label')}</h2>
        <p className="text-3xl md:text-5xl font-serif leading-tight mb-8">
          {t('title')} <br/>
          {t('span1')}
        </p>
        <p className="text-lg text-muted">
          {t('text')}
        </p>
      </div>
    </section>
  );
}
