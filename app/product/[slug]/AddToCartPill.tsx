'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { formatCZK } from '@/lib/format';
import clsx from 'clsx';

type Product = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  price: number;
  sizes: string[];
};

export default function AddToCartPill({ product }: { product: Product }) {
  const [size, setSize] = useState<string>(product.sizes[0] ?? 'UNI');
  const addItem = useCart((s) => s.addItem);

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[min(680px,calc(100vw-24px))]"
      role="region"
      aria-label="Přidat do košíku"
    >
      <div className="glass rounded-full pl-2 pr-2 py-2 flex items-center gap-2 sm:gap-3 shadow-xl">
        {/* Size selector */}
        <div className="flex items-center gap-1 bg-white/40 rounded-full p-1">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              aria-pressed={size === s}
              aria-label={`Velikost ${s}`}
              className={clsx(
                'min-w-[34px] h-8 px-2 text-xs font-medium rounded-full transition-colors',
                size === s ? 'bg-ink text-beige-50' : 'text-ink/70 hover:bg-white/60',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex-1 text-center">
          <span className="serif text-xl sm:text-2xl italic">{formatCZK(product.price)}</span>
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            addItem({
              productId: product.id,
              slug: product.slug,
              title: product.title,
              imageUrl: product.imageUrl,
              size,
              quantity: 1,
              unitPrice: product.price,
            })
          }
          className="px-5 sm:px-7 h-11 rounded-full bg-ink text-beige-50 text-sm font-medium hover:bg-ink/85 active:scale-[0.98] transition"
        >
          Přidat do košíku
        </button>
      </div>
    </div>
  );
}
