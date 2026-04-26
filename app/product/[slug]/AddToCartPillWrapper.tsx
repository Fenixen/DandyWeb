'use client';
import { useState } from 'react';
import AddToCartPill from './AddToCartPill';

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

// Converts a hex color to hue degrees for CSS hue-rotate filter.
// The product image is assumed to have a base hue of ~0° (neutral/warm).
// We rotate the hue of the image to approximate the selected color.
function hexToHue(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return Math.round(h * 60 + 360) % 360;
}

export default function AddToCartPillWrapper({ product }: { product: Product }) {
  const [activeHex, setActiveHex] = useState<string | null>(
    product.colors.length > 0 ? product.colors[0].hex : null,
  );

  function handleColorChange(hex: string) {
    setActiveHex(hex);
    // Apply hue-rotate filter on the product hero image
    const img = document.getElementById('product-hero-img') as HTMLImageElement | null;
    if (!img) return;
    const hue = hexToHue(hex);
    // sepia(0.3) ensures the image has some chroma to rotate
    img.style.filter = `sepia(0.35) saturate(2.5) hue-rotate(${hue}deg)`;
  }

  return (
    <AddToCartPill
      product={product}
      onColorChange={handleColorChange}
    />
  );
}
