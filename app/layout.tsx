import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';
import GrainyBackground from '@/components/GrainyBackground';
import PillNav from '@/components/PillNav';
import Footer from '@/components/Footer';
import SlideOutCart from '@/components/SlideOutCart';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});
const serif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Dandy's Wear — Oblečení s duší",
  description:
    "Dandy's Wear. Malá česká značka. Ručně šité kousky v béžových a cihlových tónech. Objevte kolekci rozmístěnou po galerii.",
  openGraph: {
    title: "Dandy's Wear",
    description: 'Malá česká značka oblečení.',
    type: 'website',
    locale: 'cs_CZ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${inter.variable} ${serif.variable}`}>
      <body className="min-h-screen">
        <GrainyBackground />
        <PillNav />
        <main className="pt-28">{children}</main>
        <Footer />
        <SlideOutCart />
      </body>
    </html>
  );
}
