import { useTranslations } from "next-intl";

export default function Clients() {
  const t = useTranslations('HomePage.Clients');

  return (
    <section id="section-clients" className="h-screen flex flex-col justify-center items-start px-8 md:px-24 max-w-7xl mx-auto">
      <div className="max-w-3xl">
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-8">{t('title')}</h2>
        <p className="text-3xl md:text-5xl font-serif leading-tight mb-8">
          {t('text1')}
        </p>
        <p className="text-lg text-muted">
          {t('text2')}
        </p>
      </div>
    </section>
  );
}
