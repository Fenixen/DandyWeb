import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const Schema = z.object({
  code: z.string().min(1).max(40),
  subtotal: z.number().int().nonnegative(),
});

export async function POST(req: NextRequest) {
  const parsed = Schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });

  const d = await prisma.discountCode.findUnique({ where: { code: parsed.data.code.toUpperCase() } });
  if (!d || !d.active) return NextResponse.json({ error: 'Kód neexistuje.' }, { status: 404 });
  if (d.usageLimit > 0 && d.usedCount >= d.usageLimit) return NextResponse.json({ error: 'Kód byl vyčerpán.' }, { status: 410 });
  if (parsed.data.subtotal < d.minSubtotal) {
    return NextResponse.json({
      error: `Kód platí od ${Math.round(d.minSubtotal / 100)} Kč.`,
    }, { status: 400 });
  }

  return NextResponse.json({
    discount: {
      code: d.code,
      type: d.type,
      value: d.value,
      minSubtotal: d.minSubtotal,
    },
  });
}
