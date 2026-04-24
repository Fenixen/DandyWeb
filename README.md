# Dandy's Wear

Malý e-shopový engine pro značku **Dandy's Wear** — galerie místo mřížky produktů,
béžovo-cihlová paleta se zrnitým pozadím a glassmorphic UI.

Postaveno na **Next.js 14 (App Router) + Tailwind CSS + Prisma/SQLite**.
Běží bez databázového serveru — stačí Raspberry Pi a pár MB.

---

## Obsah

1. [Přehled funkcí](#1-přehled-funkcí)
2. [Lokální vývoj](#2-lokální-vývoj)
3. [Deploy na Raspberry Pi (Docker)](#3-deploy-na-raspberry-pi--docker)
4. [Deploy přes PM2 (bez Dockeru)](#4-deploy-přes-pm2-bez-dockeru)
5. [Konfigurace platby QR (SPAYD, IBAN)](#5-konfigurace-platby-qr-spayd-iban)
6. [Packeta / Zásilkovna widget](#6-packeta--zásilkovna-widget)
7. [Admin přístup](#7-admin-přístup)
8. [Struktura projektu](#8-struktura-projektu)

---

## 1. Přehled funkcí

- **Galerie místo katalogu** — homepage je plátno, na kterém jsou produkty rozmístěny
  na ručně zvolených souřadnicích. Žádné nadpisy, ceny ani tlačítka. Hover = jemné
  zvětšení. Každý obrázek je přímý odkaz na detail.
- **Detail produktu** — velký hero obrázek, editorial text, plovoucí „pill" dole
  s výběrem velikosti, cenou a tlačítkem *Přidat do košíku*.
- **Slide-out košík** — z pravé strany se vysouvá skleněný panel s položkami,
  quantity stepperem, políčkem na slevový kód a tlačítkem *Pokračovat k pokladně*.
  Stav se uchovává v localStorage (Zustand + persist).
- **Pokladna** — jednosekcový formulář: kontakt, doprava (Zásilkovna / kurýr),
  platba (bankovní převod s QR / dobírka +49 Kč), slevový kód z košíku.
- **Objednávka přijata** — pokud platba převodem, stránka zobrazí velký
  **SPAYD QR kód** (bankovní aplikace jej načte) s IBAN, VS a zprávou.
  Pokud dobírka, zobrazí info o úhradě při převzetí.
- **Admin** (`/admin`, chráněno heslem v `.env`) —
  - Objednávky: seznam, změna stavu (nová → zaplaceno → odesláno / zrušeno).
  - Produkty: CRUD (titulek, slug, cena, obrázek, posX/Y/W, rotace, sklad, velikosti).
  - Slevové kódy: CRUD, % nebo pevné Kč, minimální mezisoučet, limit použití.
- **O nás**, **Wallpapers** (ke stažení), **FAQ** — statické stránky v češtině.
- **Zrnité pozadí** — fixní SVG noise overlay přes radiální gradient
  z #F5E6D3 do #F0C9C0. Jednou definováno v `<GrainyBackground />` v `app/layout.tsx`.

---

## 2. Lokální vývoj

Požadavky: **Node.js 20+** a npm.

```bash
git clone <repo> dandys-wear
cd dandys-wear
cp .env.example .env      # upravte hodnoty!
npm install
npx prisma db push        # vytvoří data/dandys.db
npm run db:seed           # naplní 8 produktů a 2 slevové kódy
npm run dev               # http://localhost:3000
```

### Užitečné skripty

| příkaz              | co dělá                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | vývojový server na portu 3000                      |
| `npm run build`     | produkční build + prisma generate                  |
| `npm start`         | spustí build na portu 3000                         |
| `npm run db:push`   | vytvoří/aktualizuje SQLite schema                  |
| `npm run db:seed`   | naseeduje demo produkty a kódy                     |

---

## 3. Deploy na Raspberry Pi — Docker

Nejjednodušší cesta. Pi potřebuje **Docker** a **docker compose plugin**.

### Příprava Pi (jednorázově)

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# odhlaste se a přihlaste znovu
```

### Nasazení

```bash
# na Raspberry Pi
git clone <repo> ~/dandys-wear
cd ~/dandys-wear
cp .env.example .env
nano .env                 # nastavte ADMIN_PASSWORD, ADMIN_SECRET, SHOP_IBAN

docker compose up -d --build
docker compose exec dandys-wear npm run db:seed   # jen poprvé
```

Web poběží na `http://<IP-pi>:3000`. Data (`data/dandys.db` a `public/uploads/`)
jsou mountnutá na hostitele, takže **přežijí rebuild**.

### Aktualizace

```bash
git pull
docker compose up -d --build
```

### Reverse proxy s HTTPS (doporučené)

Před aplikaci nasaďte **Caddy** nebo **Nginx** a namiřte doménu na port 3000:

```caddyfile
dandyswear.cz {
  reverse_proxy localhost:3000
}
```

---

## 4. Deploy přes PM2 (bez Dockeru)

Pokud nechcete Docker, použijte **PM2**:

```bash
sudo apt install -y nodejs npm           # nebo nvm
sudo npm i -g pm2

git clone <repo> /home/pi/dandys-wear
cd /home/pi/dandys-wear
cp .env.example .env && nano .env
npm install
npx prisma db push
npm run db:seed
npm run build

pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd       # vypíše příkaz, který spusťte jako root
```

Ovládání:
```bash
pm2 logs dandys-wear
pm2 restart dandys-wear
pm2 stop dandys-wear
```

---

## 5. Konfigurace platby QR (SPAYD, IBAN)

QR kód na stránce *Objednávka přijata* se generuje v `/api/spayd/[orderId]`
pomocí balíčku `qrcode` a používá český standard **SPAYD 1.0**:

```
SPD*1.0*ACC:<IBAN>*AM:<amount>*CC:CZK*MSG:DANDYS <order-number>*X-VS:<variableSymbol>
```

### Kde vzít IBAN

1. Přihlaste se do internetového bankovnictví.
2. Najděte detail svého účtu → **IBAN** (začíná `CZ...`, 24 znaků).
3. Vložte jej **bez mezer** do `.env`:

```env
SHOP_IBAN="CZ6508000000192000145399"
```

### Variabilní symbol

Generuje se automaticky pro každou objednávku (10 číslic). Podle něj poznáte platbu
v bankovním výpisu.

---

## 6. Packeta / Zásilkovna widget

Pro výběr výdejního místa používáme oficiální **Packeta Widget v6**.

1. Zaregistrujte se na <https://client.packeta.com/>.
2. V **Administraci → API klíče** si vygenerujte *API klíč pro Widget*.
3. Vložte ho do `.env` **dvakrát** (backend + veřejný pro prohlížeč):

```env
PACKETA_API_KEY="<váš-klíč>"
NEXT_PUBLIC_PACKETA_API_KEY="<stejný-klíč>"
```

Pokud klíč **není nastaven**, tlačítko *Vybrat výdejní místo* spadne na prostý
textový prompt — objednávka se tak dá dokončit i bez API klíče (vhodné pro dev).

---

## 7. Admin přístup

- URL: `https://<vase-domena>/admin`
- Heslo: hodnota `ADMIN_PASSWORD` z `.env`

Cookie `admin_session` je **httpOnly**, podepsaná HMAC-SHA256 (klíč `ADMIN_SECRET`),
platná 30 dní. Middleware chrání všechny `/admin/**` a `/api/admin/**` (kromě loginu).

**Doporučujeme**: `ADMIN_SECRET` nastavte na náhodný řetězec ≥ 32 znaků:

```bash
openssl rand -hex 32
```

---

## 8. Struktura projektu

```
dandys-wear/
├── app/
│   ├── layout.tsx                 ← GrainyBackground + PillNav + Footer (pouze /o-nas) + SlideOutCart
│   ├── page.tsx                   ← Galerie (absolutně pozicované produkty)
│   ├── globals.css                ← Tailwind + .glass utilita
│   ├── product/[slug]/            ← Detail s plovoucí pill
│   ├── o-nas/                     ← Brand story (jediná stránka s footerem)
│   ├── wallpapers/                ← Tapety ke stažení
│   ├── faq/                       ← FAQ akordeon
│   ├── checkout/                  ← Formulář, success s QR
│   ├── admin/                     ← Login + dashboard (Orders/Products/Discounts)
│   └── api/
│       ├── checkout/route.ts      ← POST — validace, výpočet součtu, vytvoření Order
│       ├── spayd/[orderId]/       ← GET — PNG QR podle SPAYD formátu
│       ├── discounts/validate/    ← POST — ověření slevového kódu
│       └── admin/                 ← login, logout, orders, products, discounts CRUD
├── components/
│   ├── GrainyBackground.tsx       ← Fixed SVG feTurbulence + gradient
│   ├── PillNav.tsx                ← Glass pill navigace (fixní top center)
│   ├── SlideOutCart.tsx           ← Framer-motion drawer z pravé strany
│   ├── Footer.tsx                 ← Render jen na /o-nas (client + usePathname)
│   └── Logo.tsx                   ← Inline SVG wordmark
├── lib/
│   ├── prisma.ts                  ← Singleton PrismaClient
│   ├── cart.ts                    ← Zustand + persist; computeTotals()
│   ├── auth.ts                    ← Web Crypto HMAC sign/verify (edge-compatible)
│   └── format.ts                  ← formatCZK (halíře → „1 234 Kč")
├── prisma/
│   ├── schema.prisma              ← Product / Order / OrderItem / DiscountCode
│   └── seed.ts                    ← 8 produktů + 2 slevové kódy
├── middleware.ts                  ← Ochrana /admin a /api/admin/*
├── public/products/               ← SVG siluety (transparent bg)
├── public/wallpapers/             ← SVG tapety ke stažení
├── Dockerfile                     ← Multi-stage node:20-alpine build
├── docker-compose.yml
├── ecosystem.config.js            ← PM2
├── .env.example
└── README.md
```

### Klíčové principy designu

- **Nic neprodávat přímo na homepage** — galerie je *pozvánka*, ne katalog.
- **Zrnitost** — pozadí má SVG noise filter (`feTurbulence baseFrequency=0.9`)
  s `mix-blend-mode: multiply` a opacity 0.22. Je to *vizitka značky*.
- **Glass panely** — `rgba(255,255,255,0.35)` + `backdrop-blur(20px) saturate(140%)`.
  Nikdy ne ostrá bílá.
- **Typografie** — *Instrument Serif* pro nadpisy (kurzíva, editorial),
  *Inter* pro všechno ostatní. Žádné další fonty.

---

## Licence

Privátní projekt Dandy's Wear. Kontakt: `ahoj@dandyswear.cz`.
