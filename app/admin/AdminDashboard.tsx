'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { formatCZK } from '@/lib/format';
import { asset } from '@/lib/basepath';

type Tab = 'orders' | 'products' | 'discounts';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('orders');
  const router = useRouter();

  async function logout() {
    await fetch(asset('/api/admin/logout'), { method: 'POST' });
    router.refresh();
  }

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="serif italic text-4xl text-ink">Admin</h1>
        <button onClick={logout} className="text-sm text-ink/60 hover:text-ink underline">Odhlásit</button>
      </div>

      <div className="glass rounded-full p-1 inline-flex mb-6">
        {(['orders', 'products', 'discounts'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-5 py-2 text-sm rounded-full transition-colors',
              tab === t ? 'bg-ink text-beige-50' : 'text-ink/70 hover:bg-white/40',
            )}
          >
            {t === 'orders' ? 'Objednávky' : t === 'products' ? 'Produkty' : 'Slevy'}
          </button>
        ))}
      </div>

      {tab === 'orders' && <OrdersTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'discounts' && <DiscountsTab />}
    </section>
  );
}

/* ---------------- Orders ---------------- */

type Order = any;
function OrdersTab() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const r = await fetch(asset('/api/admin/orders'));
    const d = await r.json();
    setOrders(d.orders || []);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    setBusy(id);
    await fetch(asset('/api/admin/orders'), {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setBusy(null);
  }

  if (!orders) return <div className="text-ink/60">Načítám…</div>;
  if (orders.length === 0) return <div className="glass rounded-3xl p-8 text-ink/60">Zatím žádné objednávky.</div>;

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="glass rounded-3xl p-5">
          <div className="flex flex-wrap items-start gap-4 justify-between">
            <div>
              <div className="serif italic text-xl">{o.number}</div>
              <div className="text-xs text-ink/60">
                {new Date(o.createdAt).toLocaleString('cs-CZ')} · {o.customerName} · {o.customerEmail}
              </div>
              <div className="text-xs text-ink/60">{o.customerPhone} · {o.address}, {o.zip} {o.city}</div>
              {o.pickupPointName && <div className="text-xs text-ink/60">Výdej: {o.pickupPointName}</div>}
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCZK(o.total)}</div>
              <div className="text-xs text-ink/60">
                {o.shippingMethod === 'packeta' ? 'Zásilkovna' : 'Kurýr'} · {o.paymentMethod === 'bank_transfer' ? 'Převod' : 'Dobírka'}
              </div>
              <select
                value={o.status}
                disabled={busy === o.id}
                onChange={(e) => setStatus(o.id, e.target.value)}
                className="mt-2 px-3 py-1.5 text-sm rounded-full bg-white/70 border border-white/60"
              >
                <option value="new">Nová</option>
                <option value="paid">Zaplaceno</option>
                <option value="shipped">Odesláno</option>
                <option value="cancelled">Zrušeno</option>
              </select>
            </div>
          </div>
          <div className="mt-3 text-sm text-ink/70">
            {o.items.map((it: any) => (
              <div key={it.id}>• {it.title} · {it.size} × {it.quantity} · {formatCZK(it.unitPrice * it.quantity)}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Products ---------------- */

function ProductsTab() {
  const [products, setProducts] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  async function load() {
    const r = await fetch(asset('/api/admin/products'));
    const d = await r.json();
    setProducts(d.products || []);
  }
  useEffect(() => { load(); }, []);

  async function save(p: any) {
    const payload = { ...p, sizes: Array.isArray(p.sizes) ? p.sizes : JSON.parse(p.sizes || '[]') };
    const method = p.id ? 'PATCH' : 'POST';
    const res = await fetch(asset('/api/admin/products'), {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) { alert('Uložení selhalo.'); return; }
    setEditing(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Smazat produkt?')) return;
    await fetch(asset(`/api/admin/products?id=${id}`), { method: 'DELETE' });
    await load();
  }

  if (!products) return <div className="text-ink/60">Načítám…</div>;

  return (
    <div>
      <button
        onClick={() => setEditing({
          slug: '', title: '', description: '', price: 0, imageUrl: '',
          posX: '50%', posY: '50%', posW: '200px', rotation: 0, stock: 10, sizes: ['S', 'M', 'L'],
        })}
        className="mb-4 px-5 py-2 rounded-full bg-ink text-beige-50 text-sm"
      >
        + Nový produkt
      </button>

      <div className="grid md:grid-cols-2 gap-3">
        {products.map((p) => (
          <div key={p.id} className="glass rounded-3xl p-4 flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.imageUrl} alt="" className="w-20 h-20 object-contain bg-white/40 rounded-xl p-1" />
            <div className="flex-1 min-w-0">
              <div className="serif italic text-lg">{p.title}</div>
              <div className="text-xs text-ink/60">{p.slug} · {formatCZK(p.price)} · sklad {p.stock}</div>
              <div className="text-xs text-ink/50">pos {p.posX}/{p.posY} · w {p.posW} · rot {p.rotation}°</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setEditing({ ...p, sizes: JSON.parse(p.sizes) })} className="text-xs px-3 py-1 rounded-full bg-white/60">Upravit</button>
                <button onClick={() => remove(p.id)} className="text-xs px-3 py-1 rounded-full bg-dusty-100 text-dusty-500">Smazat</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProductEditor value={editing} onClose={() => setEditing(null)} onSave={save} />}
    </div>
  );
}

function ProductEditor({ value, onClose, onSave }: { value: any; onClose: () => void; onSave: (p: any) => void }) {
  const [p, setP] = useState<any>(value);
  const field = (k: string, label: string, type = 'text') => (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-1">{label}</span>
      <input
        type={type}
        value={p[k] ?? ''}
        onChange={(e) => setP({ ...p, [k]: type === 'number' ? Number(e.target.value) : e.target.value })}
        className="w-full px-3 py-2 rounded-xl bg-white/70 border border-white/60 text-sm"
      />
    </label>
  );
  return (
    <div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="serif italic text-2xl mb-4">{p.id ? 'Upravit produkt' : 'Nový produkt'}</h2>
        <div className="grid grid-cols-2 gap-3">
          {field('title', 'Název')}
          {field('slug', 'Slug (a-z, 0-9, -)')}
          {field('price', 'Cena (halíře)', 'number')}
          {field('stock', 'Skladem', 'number')}
          {field('imageUrl', 'Obrázek URL')}
          {field('posX', 'posX (např. 12%)')}
          {field('posY', 'posY')}
          {field('posW', 'Šířka (např. 200px)')}
          {field('rotation', 'Rotace (°)', 'number')}
          <label className="block col-span-2">
            <span className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-1">Velikosti (čárkou)</span>
            <input
              value={Array.isArray(p.sizes) ? p.sizes.join(',') : p.sizes}
              onChange={(e) => setP({ ...p, sizes: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-white/60 text-sm"
            />
          </label>
          <label className="block col-span-2">
            <span className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-1">Popis</span>
            <textarea
              value={p.description}
              onChange={(e) => setP({ ...p, description: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 rounded-xl bg-white/70 border border-white/60 text-sm"
            />
          </label>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-white/60 text-sm">Zrušit</button>
          <button onClick={() => onSave(p)} className="px-5 py-2 rounded-full bg-ink text-beige-50 text-sm">Uložit</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Discounts ---------------- */

function DiscountsTab() {
  const [discounts, setDiscounts] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<any | null>(null);

  async function load() {
    const r = await fetch(asset('/api/admin/discounts'));
    const d = await r.json();
    setDiscounts(d.discounts || []);
  }
  useEffect(() => { load(); }, []);

  async function save(d: any) {
    const method = d.id ? 'PATCH' : 'POST';
    const res = await fetch(asset('/api/admin/discounts'), {
      method, headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    if (!res.ok) { alert('Uložení selhalo.'); return; }
    setEditing(null);
    await load();
  }
  async function remove(id: string) {
    if (!confirm('Smazat slevu?')) return;
    await fetch(asset(`/api/admin/discounts?id=${id}`), { method: 'DELETE' });
    await load();
  }

  if (!discounts) return <div className="text-ink/60">Načítám…</div>;

  return (
    <div>
      <button
        onClick={() => setEditing({ code: '', type: 'percent', value: 10, minSubtotal: 0, usageLimit: 0, active: true })}
        className="mb-4 px-5 py-2 rounded-full bg-ink text-beige-50 text-sm"
      >
        + Nový kód
      </button>
      <div className="space-y-2">
        {discounts.map((d) => (
          <div key={d.id} className="glass rounded-3xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-mono font-medium">{d.code}</div>
              <div className="text-xs text-ink/60">
                {d.type === 'percent' ? `${d.value} %` : `${d.value / 100} Kč`}
                {d.minSubtotal > 0 && ` · min ${d.minSubtotal / 100} Kč`}
                {' · '}{d.active ? 'aktivní' : 'neaktivní'}
                {d.usageLimit > 0 && ` · ${d.usedCount}/${d.usageLimit}`}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditing(d)} className="text-xs px-3 py-1 rounded-full bg-white/60">Upravit</button>
              <button onClick={() => remove(d.id)} className="text-xs px-3 py-1 rounded-full bg-dusty-100 text-dusty-500">Smazat</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div onClick={(e) => e.stopPropagation()} className="glass rounded-3xl p-6 max-w-md w-full">
            <h2 className="serif italic text-2xl mb-4">{editing.id ? 'Upravit' : 'Nový'} kód</h2>
            <div className="space-y-3">
              <Field label="Kód" value={editing.code} onChange={(v) => setEditing({ ...editing, code: v.toUpperCase() })} />
              <label className="block">
                <span className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-1">Typ</span>
                <select
                  value={editing.type}
                  onChange={(e) => setEditing({ ...editing, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/70 border border-white/60 text-sm"
                >
                  <option value="percent">Procenta</option>
                  <option value="fixed">Pevná částka (halíře)</option>
                </select>
              </label>
              <Field label="Hodnota" type="number" value={editing.value} onChange={(v) => setEditing({ ...editing, value: Number(v) })} />
              <Field label="Min. mezisoučet (halíře)" type="number" value={editing.minSubtotal} onChange={(v) => setEditing({ ...editing, minSubtotal: Number(v) })} />
              <Field label="Limit použití (0 = neomezeno)" type="number" value={editing.usageLimit} onChange={(v) => setEditing({ ...editing, usageLimit: Number(v) })} />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                <span className="text-sm">Aktivní</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-full bg-white/60 text-sm">Zrušit</button>
              <button onClick={() => save(editing)} className="px-5 py-2 rounded-full bg-ink text-beige-50 text-sm">Uložit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: any; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.14em] text-ink/60 mb-1">{label}</span>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl bg-white/70 border border-white/60 text-sm"
      />
    </label>
  );
}
