import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const Base = z.object({
  code: z.string().min(1).max(40).transform((s) => s.toUpperCase()),
  type: z.enum(['percent', 'fixed']),
  value: z.number().int().min(1),
  minSubtotal: z.number().int().min(0).default(0),
  usageLimit: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export async function GET() {
  const discounts = await prisma.discountCode.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ discounts });
}

export async function POST(req: NextRequest) {
  const parsed = Base.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  const d = await prisma.discountCode.create({ data: parsed.data });
  return NextResponse.json({ discount: d });
}

const PatchSchema = Base.partial().extend({ id: z.string() });

export async function PATCH(req: NextRequest) {
  const parsed = PatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  const { id, ...rest } = parsed.data;
  const d = await prisma.discountCode.update({ where: { id }, data: rest });
  return NextResponse.json({ discount: d });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Chybí id.' }, { status: 400 });
  await prisma.discountCode.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
