'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  imageUrl: string;
  size: string;
  quantity: number;
  unitPrice: number; // halíře
};

export type DiscountState = {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotal: number;
} | null;

type State = {
  items: CartItem[];
  open: boolean;
  discount: DiscountState;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  setDiscount: (d: DiscountState) => void;
  clear: () => void;
  setOpen: (o: boolean) => void;
};

export const useCart = create<State>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      discount: null,
      addItem: (item) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.productId === item.productId && x.size === item.size);
        if (i >= 0) items[i].quantity += item.quantity;
        else items.push(item);
        set({ items, open: true });
      },
      removeItem: (productId, size) =>
        set({ items: get().items.filter((x) => !(x.productId === productId && x.size === size)) }),
      updateQuantity: (productId, size, qty) =>
        set({
          items: get().items.map((x) =>
            x.productId === productId && x.size === size ? { ...x, quantity: Math.max(1, qty) } : x,
          ),
        }),
      setDiscount: (d) => set({ discount: d }),
      clear: () => set({ items: [], discount: null }),
      setOpen: (open) => set({ open }),
    }),
    { name: 'dandys-cart' },
  ),
);

export function computeTotals(
  items: CartItem[],
  discount: DiscountState,
  shippingMethod?: string,
  paymentMethod?: string,
) {
  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  let discountAmount = 0;
  if (discount && subtotal >= discount.minSubtotal) {
    discountAmount = discount.type === 'percent'
      ? Math.round((subtotal * discount.value) / 100)
      : discount.value;
    if (discountAmount > subtotal) discountAmount = subtotal;
  }
  const shippingCost = shippingMethod === 'packeta' ? 9900 : shippingMethod === 'cod' ? 12900 : 0;
  const surcharge = paymentMethod === 'cod' ? 4900 : 0;
  const total = subtotal - discountAmount + shippingCost + surcharge;
  return { subtotal, discount: discountAmount, shippingCost, surcharge, total };
}
