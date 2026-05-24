import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('HomePage.Hero');

  return (
    <section id="section-hero" className="h-screen flex flex-col justify-center items-start px-8 md:px-24 max-w-7xl mx-auto">
      <h1 className="font-serif text-6xl md:text-9xl leading-none mb-6 text-foreground drop-shadow-2xl">
        {t('title')}
      </h1>
      <p className="text-xl md:text-2xl text-muted max-w-xl drop-shadow-lg font-light">
        {t('subtitle')} <br />
        {t('description')}
      </p>
    </section>
  );
}
