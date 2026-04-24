'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Footer renders ONLY on /o-nas as per spec.
export default function Footer() {
  const pathname = usePathname();
  if (pathname !== '/o-nas') return null;

  return (
    <footer className="mt-24 pb-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div>
            <div className="serif text-2xl italic text-ink">Dandy&apos;s Wear</div>
            <p className="text-sm text-ink/70 mt-1">Oblečení s duší, šité v Čechách.</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm text-ink/75">
            <Link href="/faq" className="hover:text-ink">FAQ</Link>
            <Link href="/wallpapers" className="hover:text-ink">Wallpapers</Link>
            <a href="mailto:ahoj@dandyswear.cz" className="hover:text-ink">ahoj@dandyswear.cz</a>
            <a href="https://instagram.com/dandyswear" className="hover:text-ink">Instagram</a>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs text-ink/50">
          © {new Date().getFullYear()} Dandy&apos;s Wear · IČO 00000000 · Vyrobeno s láskou v Praze
        </p>
      </div>
    </footer>
  );
}
