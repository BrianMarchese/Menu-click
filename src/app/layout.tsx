import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://menu-click-bm.vercel.app/'),
  title: "Menú-Click | El Club del Bajón",
  description: "El club del bajón vgg",
  keywords: [
    'hamburguesas VGG',
    'delivery Villa Gobernador Gálvez',
    'Club del Bajón',
    'papas con cheddar',
    'comida rápida VGG',
    'hamburguesería VGG',
    'hamburguesas'
  ],
  openGraph: {
    title: 'Club del Bajón VGG — Pedí Online',
    description: 'Hamburguesas dobles, papas cargadas y combos. ¡20% OFF en efectivo!',
    url: 'https://clubdelbajonvgg.vercel.app',
    siteName: 'Club del Bajón VGG',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        alt: 'Club del Bajón VGG Hamburguesas',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
