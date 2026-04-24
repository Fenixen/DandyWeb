import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCZK } from '@/lib/format';
import { asset } from '@/lib/basepath';

export const dynamic = 'force-dynamic';

export default async function SuccessPage({ params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: { items: true },
  });
  if (!order) notFound();

  const iban = process.env.SHOP_IBAN || 'CZ0000000000000000000000';
  const isBank = order.paymentMethod === 'bank_transfer';

  return (
    <section className="mx-auto max-w-[780px] px-6 py-10 md:py-16">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-[0.24em] text-ink/50 mb-2">Vaše Objednávka byla přijata</p>
        <h1 className="serif italic text-5xl md:text-6xl text-ink mb-2">Děkujeme!</h1>
        <p className="text-ink/70">
          Číslo objednávky <span className="font-medium text-ink">{order.number}</span>
        </p>
      </div>

      {isBank ? (
        <div className="glass rounded-3xl p-8 md:p-10 text-center">
          <h2 className="serif italic text-3xl text-ink mb-2">Zaplatit QR kódem</h2>
          <p className="text-ink/70 text-sm mb-6">
            Načtěte QR svou bankovní aplikací. Platbu spárujeme podle variabilního symbolu.
          </p>
          <div className="mx-auto w-[280px] h-[280px] bg-white/70 rounded-3xl p-4 border border-white/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(`/api/spayd/${order.id}`)}
              alt="QR kód pro platbu"
              className="w-full h-full"
            />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-left max-w-md mx-auto">
            <dt className="text-ink/60">Částka</dt>
            <dd className="text-right font-medium">{formatCZK(order.total)}</dd>
            <dt className="text-ink/60">Variabilní symbol</dt>
            <dd className="text-right font-mono">{order.variableSymbol}</dd>
            <dt className="text-ink/60">IBAN</dt>
            <dd className="text-right font-mono break-all">{iban}</dd>
            <dt className="text-ink/60">Zpráva</dt>
            <dd className="text-right">DANDYS {order.number}</dd>
          </dl>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 md:p-10 text-center">
          <h2 className="serif italic text-3xl text-ink mb-2">Platba na dobírku</h2>
          <p className="text-ink/75 max-w-md mx-auto">
            Objednávka bude uhrazena při převzetí.
            Celková částka: <strong className="text-ink">{formatCZK(order.total)}</strong>
          </p>
        </div>
      )}

      {/* Order summary */}
      <div className="glass rounded-3xl p-6 mt-6">
        <h3 className="serif italic text-2xl mb-4">Souhrn objednávky</h3>
        <ul className="space-y-2 mb-4">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between text-sm">
              <span>{it.title} <span className="text-ink/60">· {it.size} × {it.quantity}</span></span>
              <span>{formatCZK(it.unitPrice * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-white/40 pt-3 space-y-1 text-sm">
          <Line label="Mezisoučet" value={formatCZK(order.subtotal)} />
          {order.discount > 0 && <Line label="Sleva" value={`−${formatCZK(order.discount)}`} />}
          <Line label="Doprava" value={formatCZK(order.shippingCost)} />
          {order.surcharge > 0 && <Line label="Dobírka" value={formatCZK(order.surcharge)} />}
          <Line label="Celkem" value={formatCZK(order.total)} bold />
        </div>
        {order.pickupPointName && (
          <p className="mt-4 text-sm text-ink/70">
            Výdejní místo: <strong>{order.pickupPointName}</strong>
          </p>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="inline-block px-6 py-3 rounded-full bg-ink text-beige-50 hover:bg-ink/85">
          Zpět na úvod
        </Link>
      </div>
    </section>
  );
}

function Line({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-medium text-base pt-1 border-t border-white/40' : ''}`}>
      <span className="text-ink/70">{label}</span>
      <span>{value}</span>
    </div>
  );
}
