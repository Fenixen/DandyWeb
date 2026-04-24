import { asset } from '@/lib/basepath';

export const metadata = { title: "Wallpapers — Dandy's Wear" };

const wallpapers = [
  { slug: 'beige-grain', title: 'Béžová zrnitost', desc: 'Jemný papírový tón.', gradient: 'linear-gradient(135deg,#F5E6D3,#ECD0AC)' },
  { slug: 'dusty-sunset', title: 'Dusty západ', desc: 'Cihlová přes béžovou.', gradient: 'radial-gradient(circle at 30% 20%,#F5E6D3,#F0C9C0 70%,#E2A89C)' },
  { slug: 'clay-field', title: 'Hliněné pole', desc: 'Teplá zemitá plocha.', gradient: 'linear-gradient(160deg,#C96F55,#7A3A26)' },
  { slug: 'cream-breath', title: 'Krémový dech', desc: 'Světle minimalistický.', gradient: 'linear-gradient(135deg,#FBF5EC,#ECDDB8)' },
];

export default function WallpapersPage() {
  return (
    <section className="mx-auto max-w-[1100px] px-6 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.24em] text-ink/50 mb-4">Zdarma ke stažení</p>
      <h1 className="serif italic text-5xl md:text-6xl leading-[0.95] text-ink mb-3">Wallpapers</h1>
      <p className="text-ink/70 max-w-[520px] mb-12">
        Pozadí pro váš telefon nebo laptop v duchu Dandy paletového klidu.
        Tapety si můžete uložit dlouhým stiskem nebo kliknutím na odkaz.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallpapers.map((w) => (
          <div key={w.slug} className="glass rounded-3xl p-5">
            <div
              className="aspect-[9/14] md:aspect-[4/5] rounded-2xl relative overflow-hidden"
              style={{ background: w.gradient }}
            >
              <svg
                className="absolute inset-0 w-full h-full mix-blend-multiply opacity-20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <filter id={`n-${w.slug}`}>
                  <feTurbulence baseFrequency="0.9" numOctaves="2" />
                  <feColorMatrix values="0 0 0 0 0.1  0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 0.9 0" />
                </filter>
                <rect width="100%" height="100%" filter={`url(#n-${w.slug})`} />
              </svg>
              <div className="absolute bottom-5 left-5 serif italic text-beige-50 text-2xl">
                Dandy&apos;s Wear
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="serif italic text-xl">{w.title}</div>
                <div className="text-xs text-ink/60">{w.desc}</div>
              </div>
              <a
                href={asset(`/wallpapers/${w.slug}.svg`)}
                download
                className="px-4 py-2 rounded-full bg-ink text-beige-50 text-sm hover:bg-ink/85"
              >
                Stáhnout
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
