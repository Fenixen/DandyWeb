// The Canvas — a hand-curated gallery. No titles, no prices, no buttons.
// Each product image is an absolutely-positioned link to /product/[slug].
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { asset } from '@/lib/basepath';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });

  return (
    <>
      {/* Desktop/tablet: absolute canvas */}
      <section
        aria-label="Galerie kolekce"
        className="hidden md:block relative mx-auto max-w-[1400px] h-[calc(100vh-8rem)] min-h-[640px]"
      >
        {products.map((p, i) => {
          const delayClass = ['animate-float-slow', 'animate-float-med', 'animate-float-fast'][i % 3];
          return (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              aria-label={p.title}
              className="absolute group block will-change-transform"
              style={{
                top: p.posY,
                left: p.posX,
                width: p.posW,
                // @ts-expect-error CSS var
                '--r': `${p.rotation}deg`,
                transform: `rotate(${p.rotation}deg)`,
                animationDelay: `${(i * 0.7).toFixed(2)}s`,
              }}
            >
              <div className={`${delayClass} transition-transform duration-[400ms] ease-out group-hover:scale-[1.06]`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(p.imageUrl)}
                  alt={p.title}
                  className="w-full h-auto drop-shadow-[0_14px_24px_rgba(120,60,50,0.18)] select-none"
                  draggable={false}
                />
              </div>
            </Link>
          );
        })}

        {/* Subtle center editorial marker */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <div className="serif italic text-ink/15 text-[clamp(80px,14vw,220px)] leading-none select-none">
            Dandy's Wear
          </div>
        </div>
      </section>

      {/* Mobile: masonry-ish vertical flow — still no titles/prices */}
      <section
        aria-label="Galerie kolekce (mobil)"
        className="md:hidden px-3 pb-12"
      >
        <div className="columns-2 gap-3 [&>*]:mb-3">
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              aria-label={p.title}
              className="block break-inside-avoid"
              style={{ transform: `rotate(${p.rotation / 2}deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(p.imageUrl)}
                alt={p.title}
                className="w-full h-auto drop-shadow-[0_10px_18px_rgba(120,60,50,0.14)]"
                draggable={false}
              />
            </Link>
          ))}
        </div>
        <p className="serif italic text-center text-ink/40 mt-4 text-sm">
          Ťukněte na kousek.
        </p>
      </section>
    </>
  );
}
