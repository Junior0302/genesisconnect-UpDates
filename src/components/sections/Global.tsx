import { useTranslations } from "next-intl";

export default function Global() {
  const t = useTranslations('HomePage.Global');

  return (
    <section id="section-global" className="h-[50vh] flex flex-col justify-center items-end px-8 md:px-24 max-w-7xl mx-auto text-right">
      <div className="max-w-2xl">
        <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-6">{t('label')}</h2>
        <p className="text-2xl md:text-3xl font-serif leading-tight mb-4">
          {t('text1')}
        </p>
        <p className="text-muted">
          {t('text2')}
        </p>
      </div>
    </section>
  );
}
