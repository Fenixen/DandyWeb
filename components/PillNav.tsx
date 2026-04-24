'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Logo } from './Logo';
import clsx from 'clsx';

const links = [
  { href: '/o-nas', label: 'O nás' },
  { href: '/wallpapers', label: 'Wallpapers' },
  { href: '/faq', label: 'FAQ' },
];

export default function PillNav() {
  const pathname = usePathname() || '/';
  const setOpen = useCart((s) => s.setOpen);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className="fixed top-4 left-0 right-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 gap-3">
        {/* Left wordmark */}
        <Link
          href="/"
          aria-label="Dandy's Wear — domů"
          className="glass pill pointer-events-auto pl-4 pr-5 py-2 flex items-center text-ink hover:bg-white/60 transition-colors"
        >
          <Logo className="h-6 w-auto" />
        </Link>

        {/* Center pill nav */}
        <nav
          aria-label="Hlavní navigace"
          className="glass pill pointer-events-auto px-2 py-1.5 hidden md:flex items-center gap-1"
        >
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  'px-4 py-2 text-sm rounded-full transition-colors',
                  active
                    ? 'bg-ink text-beige-50'
                    : 'text-ink/80 hover:bg-white/50 hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Right cart */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Košík (${count} položek)`}
          className="glass pill pointer-events-auto px-4 py-2 flex items-center gap-2 text-ink hover:bg-white/60 transition-colors relative"
        >
          <ShoppingBag size={18} strokeWidth={1.6} />
          <span className="text-sm hidden sm:inline">Košík</span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-dusty-500 text-beige-50 text-[11px] font-medium rounded-full grid place-items-center">
              {count}
            </span>
          )}
        </button>
      </div>

      {/* Mobile nav row */}
      <nav
        aria-label="Mobilní navigace"
        className="mt-3 mx-auto w-fit glass pill pointer-events-auto px-2 py-1.5 flex md:hidden items-center gap-1"
      >
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                'px-3 py-1.5 text-xs rounded-full transition-colors',
                active ? 'bg-ink text-beige-50' : 'text-ink/80 hover:bg-white/50',
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
