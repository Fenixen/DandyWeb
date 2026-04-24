import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { asset } from '@/lib/basepath';
import AddToCartPill from './AddToCartPill';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) notFound();

  const sizes: string[] = JSON.parse(product.sizes);

  return (
    <div className="relative pb-40">
      {/* Hero image */}
      <div className="flex flex-col items-center px-4">
        <div className="w-full max-w-[720px] h-[60vh] md:h-[68vh] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(product.imageUrl)}
            alt={product.title}
            className="max-h-full max-w-full object-contain drop-shadow-[0_30px_40px_rgba(120,60,50,0.22)]"
          />
        </div>

        {/* Editorial text block */}
        <article className="mt-10 max-w-[620px] w-full text-ink px-2">
          <Link href="/" className="text-xs uppercase tracking-[0.2em] text-ink/50 hover:text-ink">
            ← Zpět do galerie
          </Link>
          <h1 className="serif italic text-5xl md:text-6xl leading-[0.95] mt-4">{product.title}</h1>
          <div className="mt-6 text-base md:text-lg text-ink/80 leading-relaxed max-w-prose">
            {product.description}
          </div>
          <div className="mt-6 text-xs uppercase tracking-[0.2em] text-ink/50">
            Skladem · Dodání 2–3 pracovní dny · Zásilkovna
          </div>
        </article>
      </div>

      {/* Floating bottom pill */}
      <AddToCartPill
        product={{
          id: product.id,
          slug: product.slug,
          title: product.title,
          imageUrl: product.imageUrl,
          price: product.price,
          sizes,
        }}
      />
    </div>
  );
}
