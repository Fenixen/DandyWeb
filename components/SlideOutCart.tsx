'use client';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart, computeTotals } from '@/lib/cart';
import { formatCZK } from '@/lib/format';
import { asset } from '@/lib/basepath';

export default function SlideOutCart() {
  const { items, open, setOpen, updateQuantity, removeItem, discount, setDiscount } = useCart();
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) setMsg(null);
  }, [open]);

  const totals = computeTotals(items, discount);

  async function applyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(asset('/api/discounts/validate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), subtotal: totals.subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ tone: 'err', text: data.error || 'Kód neplatný' });
        setDiscount(null);
      } else {
        setDiscount(data.discount);
        setMsg({ tone: 'ok', text: `Kód ${data.discount.code} uplatněn.` });
      }
    } catch {
      setMsg({ tone: 'err', text: 'Nepodařilo se ověřit kód.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-[2px]"
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="fixed top-0 right-0 z-[70] h-full w-full sm:w-[440px] p-3 sm:p-4"
            role="dialog"
            aria-label="Nákupní košík"
          >
            <div className="glass rounded-3xl h-full flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-white/40">
                <h2 className="serif italic text-2xl text-ink">Košík</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Zavřít košík"
                  className="p-2 rounded-full hover:bg-white/50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {items.length === 0 && (
                  <div className="text-center py-20 text-ink/60">
                    <p className="serif italic text-xl mb-2">Prázdno.</p>
                    <p className="text-sm">Vyberte si něco z galerie.</p>
                  </div>
                )}

                {items.map((it) => (
                  <div
                    key={`${it.productId}-${it.size}-${it.color}`}
                    className="flex gap-3 items-start p-3 bg-white/30 rounded-2xl border border-white/50"
                  >
                    <div className="w-16 h-16 bg-white/50 rounded-xl overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(it.imageUrl)} alt={it.title} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{it.title}</div>
                          <div className="text-xs text-ink/60 mt-0.5">
                            Velikost {it.size}
                            {it.colorLabel && (
                              <span className="ml-2 inline-flex items-center gap-1">
                                <span
                                  className="inline-block w-3 h-3 rounded-full border border-ink/20"
                                  style={{ backgroundColor: it.color }}
                                />
                                {it.colorLabel}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(it.productId, it.size, it.color)}
                          aria-label="Odebrat"
                          className="p-1.5 text-ink/50 hover:text-dusty-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 bg-white/60 rounded-full p-0.5">
                          <button
                            onClick={() => updateQuantity(it.productId, it.size, it.color, it.quantity - 1)}
                            aria-label="Snížit"
                            className="w-6 h-6 rounded-full hover:bg-white grid place-items-center"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-5 text-center">{it.quantity}</span>
                          <button
                            onClick={() => updateQuantity(it.productId, it.size, it.color, it.quantity + 1)}
                            aria-label="Zvýšit"
                            className="w-6 h-6 rounded-full hover:bg-white grid place-items-center"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="text-sm font-medium">{formatCZK(it.unitPrice * it.quantity)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/40 p-5 space-y-3">
                  <form onSubmit={applyCode} className="flex gap-2">
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="Slevový kód"
                      aria-label="Slevový kód"
                      className="flex-1 px-4 py-2 rounded-full bg-white/70 border border-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-dusty-300"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="px-4 py-2 rounded-full bg-ink text-beige-50 text-sm hover:bg-ink/80 disabled:opacity-50"
                    >
                      Uplatnit
                    </button>
                  </form>
                  {msg && (
                    <p className={msg.tone === 'ok' ? 'text-xs text-green-800' : 'text-xs text-dusty-500'}>
                      {msg.text}
                    </p>
                  )}

                  <div className="space-y-1 text-sm pt-2 border-t border-white/40">
                    <div className="flex justify-between"><span className="text-ink/70">Mezisoučet</span><span>{formatCZK(totals.subtotal)}</span></div>
                    {totals.discount > 0 && (
                      <div className="flex justify-between text-dusty-500"><span>Sleva</span><span>−{formatCZK(totals.discount)}</span></div>
                    )}
                    <div className="flex justify-between font-medium text-base pt-1">
                      <span>Celkem</span>
                      <span>{formatCZK(totals.total)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={() => setOpen(false)}
                    className="block text-center px-6 py-3 rounded-full bg-ink text-beige-50 hover:bg-ink/85 transition-colors font-medium"
                  >
                    Pokračovat k pokladně
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
