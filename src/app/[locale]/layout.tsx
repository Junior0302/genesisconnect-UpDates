import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono, Geist } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/ui/SmoothScroll";
import ScrollControls from "@/components/ui/ScrollControls";
import { defaultSEO } from "@/lib/seo";
import { TransitionProvider } from "@/context/TransitionContext";
import { SoundProvider } from "@/context/SoundContext";
// import Scene from "@/components/three/Scene";
import SceneWrapper from "@/components/three/SceneWrapper";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getTranslations} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

type AppLocale = (typeof routing.locales)[number];

/* const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
}); */

const surgena = localFont({
  src: [
    {
      path: "../../fonts/Surgena-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/Surgena-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/Surgena-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-surgena",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...defaultSEO.openGraph,
      title: t('title'),
      description: t('description'),
      locale: locale,
    },
    twitter: {
      ...defaultSEO.twitter,
      title: t('title'),
      description: t('description'),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as AppLocale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${surgena.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <NextIntlClientProvider messages={messages}>
          <SoundProvider>
            <TransitionProvider>
              <SceneWrapper />
              <SmoothScroll />
              <ScrollControls />
              <CustomCursor />
              <Navbar />
              <main className="flex-grow content-offset">
                {children}
              </main>
              <Footer />
            </TransitionProvider>
          </SoundProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
