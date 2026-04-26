'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart';
import { formatCZK } from '@/lib/format';
import clsx from 'clsx';

type ColorOption = { label: string; hex: string };

type Product = {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  price: number;
  sizes: string[];
  colors: ColorOption[];
};

export default function AddToCartPill({ product, onColorChange }: {
  product: Product;
  onColorChange?: (hex: string) => void;
}) {
  const [size, setSize] = useState<string>(product.sizes[0] ?? 'UNI');
  const [color, setColor] = useState<ColorOption | null>(
    product.colors.length > 0 ? product.colors[0] : null,
  );
  const addItem = useCart((s) => s.addItem);

  function handleColorSelect(c: ColorOption) {
    setColor(c);
    onColorChange?.(c.hex);
  }

  const hasColors = product.colors.length > 0;
  const canAdd = !hasColors || color !== null;

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[min(680px,calc(100vw-24px))]"
      role="region"
      aria-label="Přidat do košíku"
    >
      <div className="glass rounded-3xl pl-2 pr-2 py-2 flex flex-col gap-2 shadow-xl">

        {/* Color selector row */}
        {hasColors && (
          <div className="flex items-center gap-2 px-2 pt-1">
            <span className="text-xs text-ink/50 uppercase tracking-[0.14em] shrink-0">Barva</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => handleColorSelect(c)}
                  aria-pressed={color?.hex === c.hex}
                  aria-label={c.label}
                  title={c.label}
                  className={clsx(
                    'w-7 h-7 rounded-full border-2 transition-all',
                    color?.hex === c.hex
                      ? 'border-ink scale-110 shadow-md'
                      : 'border-transparent hover:border-ink/30',
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {color && (
                <span className="text-xs text-ink/60 ml-1">{color.label}</span>
              )}
            </div>
          </div>
        )}

        {/* Size + price + CTA row */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            disabled={!canAdd}
            onClick={() =>
              addItem({
                productId: product.id,
                slug: product.slug,
                title: product.title,
                imageUrl: product.imageUrl,
                size,
                color: color?.hex ?? '',
                colorLabel: color?.label ?? '',
                quantity: 1,
                unitPrice: product.price,
              })
            }
            className={clsx(
              'px-5 sm:px-7 h-11 rounded-full text-sm font-medium transition',
              canAdd
                ? 'bg-ink text-beige-50 hover:bg-ink/85 active:scale-[0.98]'
                : 'bg-ink/30 text-beige-50/60 cursor-not-allowed',
            )}
          >
            Přidat do košíku
          </button>
        </div>
      </div>
    </div>
  );
}
