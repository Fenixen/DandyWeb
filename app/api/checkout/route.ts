import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const Schema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    size: z.string(),
    quantity: z.number().int().min(1).max(20),
  })).min(1),
  customer: z.object({
    customerName: z.string().min(2).max(120),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(6).max(40),
    address: z.string().min(3).max(200),
    city: z.string().min(2).max(80),
    zip: z.string().min(3).max(20),
    note: z.string().max(500).optional(),
  }),
  shippingMethod: z.enum(['packeta', 'cod']),
  paymentMethod: z.enum(['bank_transfer', 'cod']),
  discountCode: z.string().optional(),
  pickupPoint: z.object({ id: z.string(), name: z.string() }).optional(),
});

function genOrderNumber(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${y}${m}${dd}-${rand}`;
}

function genVariableSymbol(): string {
  // 10 digit numeric (fits Czech VS max)
  return Math.floor(1_000_000_000 + Math.random() * 8_999_999_999).toString();
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Chybná data.' }, { status: 400 }); }
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Neplatná objednávka.', details: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Fetch products from DB — don't trust client prices
  const productIds = data.items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const byId = new Map(products.map((p) => [p.id, p]));
  for (const it of data.items) {
    if (!byId.has(it.productId)) {
      return NextResponse.json({ error: `Produkt neexistuje.` }, { status: 400 });
    }
  }

  let subtotal = 0;
  const itemRows = data.items.map((it) => {
    const p = byId.get(it.productId)!;
    subtotal += p.price * it.quantity;
    return { productId: p.id, size: it.size, quantity: it.quantity, unitPrice: p.price, title: p.title };
  });

  // Apply discount
  let discountAmount = 0;
  let discountId: string | null = null;
  if (data.discountCode) {
    const d = await prisma.discountCode.findUnique({ where: { code: data.discountCode.toUpperCase() } });
    if (d && d.active && (d.usageLimit === 0 || d.usedCount < d.usageLimit) && subtotal >= d.minSubtotal) {
      discountAmount = d.type === 'percent'
        ? Math.round((subtotal * d.value) / 100)
        : Math.min(d.value, subtotal);
      discountId = d.id;
    }
  }

  const shippingCost = data.shippingMethod === 'packeta' ? 9900 : 12900;
  const surcharge = data.paymentMethod === 'cod' ? 4900 : 0;
  const total = subtotal - discountAmount + shippingCost + surcharge;

  const number = genOrderNumber();
  const variableSymbol = genVariableSymbol();

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        number,
        customerName: data.customer.customerName,
        customerEmail: data.customer.customerEmail,
        customerPhone: data.customer.customerPhone,
        address: data.customer.address,
        city: data.customer.city,
        zip: data.customer.zip,
        note: data.customer.note,
        shippingMethod: data.shippingMethod,
        pickupPointId: data.pickupPoint?.id,
        pickupPointName: data.pickupPoint?.name,
        paymentMethod: data.paymentMethod,
        subtotal,
        discount: discountAmount,
        shippingCost,
        surcharge,
        total,
        variableSymbol,
        items: { create: itemRows },
      },
    });
    if (discountId) {
      await tx.discountCode.update({ where: { id: discountId }, data: { usedCount: { increment: 1 } } });
    }
    return o;
  });

  return NextResponse.json({ orderId: order.id, number: order.number, total: order.total });
}
