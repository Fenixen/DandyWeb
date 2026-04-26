import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const Base = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(4000),
  price: z.number().int().min(0),
  imageUrl: z.string().min(1).max(500),
  posX: z.string().min(1).max(20),
  posY: z.string().min(1).max(20),
  posW: z.string().min(1).max(20),
  rotation: z.number().min(-45).max(45),
  stock: z.number().int().min(0).max(9999),
  sizes: z.array(z.string().min(1).max(10)).min(1).max(10),
  colors: z.array(
    z.object({
      label: z.string().min(1).max(50),
      hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    })
  ).default([]),
});

export async function GET() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const parsed = Base.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.', details: parsed.error.flatten() }, { status: 400 });
  const d = parsed.data;
  const p = await prisma.product.create({
    data: {
      ...d,
      sizes: JSON.stringify(d.sizes),
      colors: JSON.stringify(d.colors),
    },
  });
  return NextResponse.json({ product: p });
}

const PatchSchema = Base.partial().extend({ id: z.string() });

export async function PATCH(req: NextRequest) {
  const parsed = PatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  const { id, sizes, colors, ...rest } = parsed.data;
  const data: any = { ...rest };
  if (sizes) data.sizes = JSON.stringify(sizes);
  if (colors !== undefined) data.colors = JSON.stringify(colors);
  const p = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ product: p });
}

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Chybí id.' }, { status: 400 });
  await prisma.product.delete({ where: { id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
