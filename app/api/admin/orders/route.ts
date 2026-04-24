import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
    take: 200,
  });
  return NextResponse.json({ orders });
}

const PatchSchema = z.object({
  id: z.string(),
  status: z.enum(['new', 'paid', 'shipped', 'cancelled']),
});

export async function PATCH(req: NextRequest) {
  const parsed = PatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  const o = await prisma.order.update({ where: { id: parsed.data.id }, data: { status: parsed.data.status } });
  return NextResponse.json({ order: o });
}
