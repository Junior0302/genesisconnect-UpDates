import { useTranslations } from "next-intl";

export default function Expertise() {
  const t = useTranslations('HomePage.Expertise');

  return (
    <section id="section-expertise" className="min-h-screen flex flex-col justify-center px-8 md:px-24 max-w-7xl mx-auto py-24">
      <h2 className="text-sm uppercase tracking-[0.2em] text-muted mb-16">{t('label')}</h2>
      
      <div className="grid gap-24">
        <div className="md:ml-auto md:w-1/2">
          <h3 className="text-3xl font-serif mb-4">{t('items.websites.title')}</h3>
          <p className="text-muted text-lg">{t('items.websites.desc')}</p>
        </div>
        
        <div className="md:mr-auto md:w-1/2">
          <h3 className="text-3xl font-serif mb-4">{t('items.platforms.title')}</h3>
          <p className="text-muted text-lg">{t('items.platforms.desc')}</p>
        </div>
        
        <div className="md:ml-auto md:w-1/2">
          <h3 className="text-3xl font-serif mb-4">{t('items.performance.title')}</h3>
          <p className="text-muted text-lg">{t('items.performance.desc')}</p>
        </div>
      </div>
    </section>
  );
}
