import { NextRequest } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// SPAYD: SPD*1.0*ACC:<IBAN>*AM:<amount>*CC:CZK*MSG:<msg>*X-VS:<vs>
export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.orderId } });
  if (!order) return new Response('Not found', { status: 404 });

  const iban = (process.env.SHOP_IBAN || 'CZ0000000000000000000000').replace(/\s+/g, '');
  const amount = (order.total / 100).toFixed(2);
  const msg = `DANDYS ${order.number}`.replace(/[^A-Z0-9 -]/gi, '');
  const spayd = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK*MSG:${msg}*X-VS:${order.variableSymbol}`;

  const png = await QRCode.toBuffer(spayd, {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 512,
    color: { dark: '#1A1614', light: '#0000' },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=60',
    },
  });
}
