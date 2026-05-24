import { Metadata } from "next";

export const defaultSEO: Metadata = {
  title: {
    default: "Genesis Connect | From Idea to Impact",
    template: "%s | Genesis Connect",
  },
  description: "Genesis Connect is a premium digital studio specializing in immersive web experiences, high-end websites, and digital performance.",
  keywords: ["Digital Studio", "Web Design", "3D Web", "Immersive Experience", "Luxury Web Design", "Genesis Connect"],
  authors: [{ name: "Genesis Connect" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://genesisconnect.studio",
    siteName: "Genesis Connect",
    title: "Genesis Connect | From Idea to Impact",
    description: "Genesis Connect is a premium digital studio specializing in immersive web experiences, high-end websites, and digital performance.",
    images: [
      {
        url: "https://genesisconnect.studio/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Genesis Connect Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Genesis Connect | From Idea to Impact",
    description: "Genesis Connect is a premium digital studio specializing in immersive web experiences, high-end websites, and digital performance.",
    images: ["https://genesisconnect.studio/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
