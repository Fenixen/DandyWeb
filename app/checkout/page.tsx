'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart, computeTotals } from '@/lib/cart';
import { formatCZK } from '@/lib/format';
import { asset } from '@/lib/basepath';
import clsx from 'clsx';
import { MapPin } from 'lucide-react';

type PickupPoint = { id: string; name: string } | null;

export default function Checkout() {
  const router = useRouter();
  const { items, discount, clear } = useCart();
  const [form, setForm] = useState({
    customerName: '', customerEmail: '', customerPhone: '',
    address: '', city: '', zip: '', note: '',
  });
  const [shippingMethod, setShippingMethod] = useState<'packeta' | 'cod'>('packeta');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cod'>('bank_transfer');
  const [pickupPoint, setPickupPoint] = useState<PickupPoint>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packetaReady, setPacketaReady] = useState(false);

  const totals = useMemo(
    () => computeTotals(items, discount, shippingMethod, paymentMethod),
    [items, discount, shippingMethod, paymentMethod],
  );

  useEffect(() => {
    // Load Packeta widget if API key available
    if (typeof window === 'undefined') return;
    const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY;
    if (!apiKey) return;
    if (document.getElementById('packeta-widget-script')) {
      setPacketaReady(true);
      return;
    }
    const s = document.createElement('script');
    s.id = 'packeta-widget-script';
    s.src = 'https://widget.packeta.com/v6/www/js/library.js';
    s.async = true;
    s.onload = () => setPacketaReady(true);
    document.body.appendChild(s);
  }, []);

  function pickPacketa() {
    const apiKey = process.env.NEXT_PUBLIC_PACKETA_API_KEY;
    // @ts-ignore
    const Packeta = typeof window !== 'undefined' ? (window as any).Packeta : null;
    if (apiKey && Packeta?.Widget?.pick) {
      Packeta.Widget.pick(apiKey, (point: any) => {
        if (point) setPickupPoint({ id: String(point.id), name: point.name });
      }, { country: 'cz' });
    } else {
      // Fallback: simple prompt
      const name = prompt('Zadejte název výdejního místa Zásilkovny:');
      if (name) setPickupPoint({ id: `manual-${Date.now()}`, name });
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      setError('Košík je prázdný.');
      return;
    }
    if (shippingMethod === 'packeta' && !pickupPoint) {
      setError('Vyberte prosím výdejní místo Zásilkovny.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(asset('/api/checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
          customer: form,
          shippingMethod,
          paymentMethod,
          discountCode: discount?.code,
          pickupPoint: pickupPoint ?? undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Něco se pokazilo.');
      } else {
        clear();
        router.push(`/checkout/success/${data.orderId}`);
      }
    } catch {
      setError('Nepodařilo se odeslat objednávku.');
    } finally {
      setBusy(false);
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-[600px] px-6 py-20 text-center">
        <h1 className="serif italic text-5xl text-ink mb-4">Košík je prázdný</h1>
        <p className="text-ink/70 mb-6">Vraťte se do galerie a najděte si něco hezkého.</p>
        <Link href="/" className="inline-block px-6 py-3 rounded-full bg-ink text-beige-50">Zpět na úvod</Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1000px] px-4 py-8 md:py-12">
      <h1 className="serif italic text-5xl md:text-6xl text-ink mb-8 px-2">Pokladna</h1>

      <div className="grid md:grid-cols-[1fr_380px] gap-6">
        <form onSubmit={submit} className="space-y-5">
          {/* Customer info */}
          <fieldset className="glass rounded-3xl p-6 space-y-4">
            <legend className="serif italic text-2xl text-ink px-2">Kontaktní údaje</legend>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Jméno a příjmení" required value={form.customerName}
                onChange={(v) => setForm({ ...form, customerName: v })} />
              <Field label="E-mail" type="email" required value={form.customerEmail}
                onChange={(v) => setForm({ ...form, customerEmail: v })} />
            </div>
            <Field label="Telefon" type="tel" required value={form.customerPhone}
              onChange={(v) => setForm({ ...form, customerPhone: v })} />
            <Field label="Adresa" required value={form.address}
              onChange={(v) => setForm({ ...form, address: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Město" required value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <Field label="PSČ" required value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} />
            </div>
            <Field label="Poznámka (volitelné)" value={form.note} onChange={(v) => setForm({ ...form, note: v })} />
          </fieldset>

          {/* Shipping */}
          <fieldset className="glass rounded-3xl p-6 space-y-3">
            <legend className="serif italic text-2xl text-ink px-2">Doprava</legend>
            <RadioRow
              checked={shippingMethod === 'packeta'}
              onChange={() => setShippingMethod('packeta')}
              title="Zásilkovna — výdejní místo"
              desc="79 Kč"
            />
            <RadioRow
              checked={shippingMethod === 'cod'}
              onChange={() => setShippingMethod('cod')}
              title="Kurýr na adresu"
              desc="129 Kč"
            />
            {shippingMethod === 'packeta' && (
              <div className="mt-2 p-4 rounded-2xl bg-white/40 border border-white/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} />
                  {pickupPoint ? pickupPoint.name : 'Žádné výdejní místo'}
                </div>
                <button
                  type="button"
                  onClick={pickPacketa}
                  className="px-4 py-2 rounded-full bg-ink text-beige-50 text-sm"
                >
                  {pickupPoint ? 'Změnit' : 'Vybrat výdejní místo'}
                </button>
              </div>
            )}
          </fieldset>

          {/* Payment */}
          <fieldset className="glass rounded-3xl p-6 space-y-3">
            <legend className="serif italic text-2xl text-ink px-2">Platba</legend>
            <RadioRow
              checked={paymentMethod === 'bank_transfer'}
              onChange={() => setPaymentMethod('bank_transfer')}
              title="Bankovní převod s QR"
              desc="Po potvrzení objednávky dostanete QR kód."
            />
            <RadioRow
              checked={paymentMethod === 'cod'}
              onChange={() => setPaymentMethod('cod')}
              title="Dobírka (+49 Kč)"
              desc="Zaplatíte kurýrovi při převzetí."
            />
          </fieldset>

          {error && (
            <div className="glass rounded-2xl p-4 text-sm text-dusty-500 border border-dusty-200">{error}</div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-4 rounded-full bg-ink text-beige-50 text-base font-medium hover:bg-ink/85 disabled:opacity-50"
          >
            {busy ? 'Odesílám…' : `Odeslat objednávku · ${formatCZK(totals.total)}`}
          </button>
        </form>

        {/* Summary */}
        <aside className="glass rounded-3xl p-6 h-fit sticky top-24">
          <h2 className="serif italic text-2xl text-ink mb-4">Shrnutí</h2>
          <div className="space-y-3 mb-4">
            {items.map((it) => (
              <div key={`${it.productId}-${it.size}`} className="flex gap-3 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(it.imageUrl)} alt={it.title} className="w-14 h-14 object-contain bg-white/40 rounded-xl p-1" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{it.title}</div>
                  <div className="text-xs text-ink/60">{it.size} × {it.quantity}</div>
                </div>
                <div className="text-sm">{formatCZK(it.unitPrice * it.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/40 pt-3 space-y-1.5 text-sm">
            <Row label="Mezisoučet" value={formatCZK(totals.subtotal)} />
            {totals.discount > 0 && <Row label={`Sleva ${discount?.code ?? ''}`} value={`−${formatCZK(totals.discount)}`} tone="discount" />}
            <Row label="Doprava" value={formatCZK(totals.shippingCost)} />
            {totals.surcharge > 0 && <Row label="Dobírka" value={formatCZK(totals.surcharge)} />}
            <div className="flex justify-between pt-2 border-t border-white/40 text-base font-medium">
              <span>Celkem</span><span>{formatCZK(totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, type = 'text', required = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.18em] text-ink/60 mb-1.5">{label}{required && ' *'}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-full bg-white/60 border border-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-dusty-300"
      />
    </label>
  );
}

function RadioRow({ checked, onChange, title, desc }: { checked: boolean; onChange: () => void; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={clsx(
        'w-full text-left p-4 rounded-2xl border transition-colors',
        checked ? 'bg-white/70 border-ink/30 shadow-sm' : 'bg-white/30 border-white/50 hover:bg-white/50',
      )}
    >
      <div className="flex items-start gap-3">
        <span className={clsx(
          'mt-1 w-4 h-4 rounded-full border-2 grid place-items-center flex-shrink-0',
          checked ? 'border-ink' : 'border-ink/40',
        )}>
          {checked && <span className="w-2 h-2 rounded-full bg-ink" />}
        </span>
        <div>
          <div className="font-medium text-sm text-ink">{title}</div>
          <div className="text-xs text-ink/60 mt-0.5">{desc}</div>
        </div>
      </div>
    </button>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'discount' }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink/70">{label}</span>
      <span className={tone === 'discount' ? 'text-dusty-500' : ''}>{value}</span>
    </div>
  );
}
