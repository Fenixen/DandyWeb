import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'node:fs';

// Minimal .env loader (Prisma’s own loader only fires via its CLI, not via tsx).
if (existsSync('.env') && !process.env.DATABASE_URL) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = /^([A-Z_][A-Z0-9_]*)\s*=\s*"?([^"]*)"?\s*$/.exec(line.trim());
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const prisma = new PrismaClient();

type P = {
  slug: string; title: string; description: string; price: number; imageUrl: string;
  posX: string; posY: string; posW: string; rotation: number; sizes: string[];
};

const products: P[] = [
  {
    slug: 'tricko-bezove',
    title: "Dandy Tričko Béžové",
    description: "Ručně střižené bavlněné tričko v měkkém béžovém odstínu. Volnější střih, zesílené lemy a decentní výšivka loga Dandy na hrudi. Vyrobeno v malé sérii v Česku.",
    price: 89000, // 890 Kč
    imageUrl: '/products/tricko-bezove.svg',
    posX: '8%', posY: '18%', posW: '220px', rotation: -9,
    sizes: ['S','M','L','XL'],
  },
  {
    slug: 'hoodie-cihla',
    title: "Hoodie Cihla",
    description: "Těžká mikina s kapucí ze 400g/m² bavlny v cihlovém odstínu. Střih inspirovaný archivními sportovními mikinami sedmdesátých let. Klokaní kapsa, kovové průchodky.",
    price: 199000,
    imageUrl: '/products/hoodie-cihla.svg',
    posX: '62%', posY: '12%', posW: '260px', rotation: 4,
    sizes: ['S','M','L','XL'],
  },
  {
    slug: 'kosile-kremova',
    title: "Košile Krémová",
    description: "Košile z lněného plátna v krémově teplé barvě. Perleťové knoflíky, měkký límeček. Nosit s teplaky nebo solo pod mikinu.",
    price: 169000,
    imageUrl: '/products/kosile-kremova.svg',
    posX: '32%', posY: '42%', posW: '240px', rotation: 7,
    sizes: ['S','M','L'],
  },
  {
    slug: 'teplaky-pisek',
    title: "Tepláky Písek",
    description: "Široké tepláky s vysokým pasem v pískové barvě. Elastický pas s tkaničkou, boční kapsy s vnitřními lemy. Velkorysá délka.",
    price: 149000,
    imageUrl: '/products/teplaky-pisek.svg',
    posX: '15%', posY: '58%', posW: '190px', rotation: -4,
    sizes: ['S','M','L','XL'],
  },
  {
    slug: 'cepice-logo',
    title: "Čepice Logo",
    description: "Šestipanelová baseballka v uhlově tmavém odstínu s výšivkou D. Nastavitelný kovový pásek. Ručně sestavená v pražské dílně.",
    price: 79000,
    imageUrl: '/products/cepice-logo.svg',
    posX: '74%', posY: '62%', posW: '180px', rotation: -6,
    sizes: ['UNI'],
  },
  {
    slug: 'mikina-zip-rust',
    title: "Mikina Zip Rust",
    description: "Mikina na zip v rezavě rust odstínu. Oboustranný zip s kovovým jezdcem, žebrované lemy, klasický střih.",
    price: 219000,
    imageUrl: '/products/mikina-zip-rust.svg',
    posX: '47%', posY: '70%', posW: '250px', rotation: 10,
    sizes: ['S','M','L','XL'],
  },
  {
    slug: 'plet-bezova',
    title: "Pletený Svetr Béžový",
    description: "Hrubě pletený svetr z recyklované vlny a alpaky. Rolák, objemný střih. Ideální pro podzimní rána na balkóně.",
    price: 259000,
    imageUrl: '/products/plet-bezova.svg',
    posX: '78%', posY: '32%', posW: '210px', rotation: 3,
    sizes: ['S','M','L'],
  },
  {
    slug: 'sala-ruzova',
    title: "Šála Růžová Dusty",
    description: "Dlouhá vlněná šála v dusty pink odstínu s odvahou šaliny. Ručně střapcované konce. Omotejte dvakrát a vyražte ven.",
    price: 99000,
    imageUrl: '/products/sala-ruzova.svg',
    posX: '4%', posY: '45%', posW: '140px', rotation: 16,
    sizes: ['UNI'],
  },
];

const discounts = [
  { code: 'DANDY10', type: 'percent', value: 10, minSubtotal: 0, usageLimit: 0, active: true },
  { code: 'WELCOME50', type: 'fixed', value: 5000, minSubtotal: 50000, usageLimit: 0, active: true },
];

async function main() {
  console.log('Seeding products…');
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        posX: p.posX, posY: p.posY, posW: p.posW, rotation: p.rotation,
        sizes: JSON.stringify(p.sizes),
      },
      create: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl,
        posX: p.posX, posY: p.posY, posW: p.posW, rotation: p.rotation,
        stock: 10,
        sizes: JSON.stringify(p.sizes),
      },
    });
  }
  console.log('Seeding discount codes…');
  for (const d of discounts) {
    await prisma.discountCode.upsert({
      where: { code: d.code },
      update: d,
      create: d,
    });
  }
  console.log('Seed complete.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
