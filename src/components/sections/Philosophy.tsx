import { useTranslations } from "next-intl";

export default function Philosophy() {
  const t = useTranslations('HomePage.Philosophy');

  return (
    <section id="section-philosophy" className="h-screen flex flex-col justify-center items-center px-8 text-center bg-black/5 backdrop-blur-sm">
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-8">{t('label')}</h2>
      <p className="text-4xl md:text-6xl font-serif leading-tight max-w-4xl mb-8">
        {t('title')}
      </p>
      <p className="text-xl text-muted max-w-2xl">
        {t('text')}
      </p>
    </section>
  );
}
