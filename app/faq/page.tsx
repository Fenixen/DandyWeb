'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const faqs = [
  {
    q: 'Jak dlouho trvá doručení?',
    a: 'Obvykle 2–6 pracovních dnů. Balíky odesíláme ihned po vyšití výšivky a zkompletování balíčku.',
  },
  {
    q: 'Mohu zboží vrátit nebo vyměnit?',
    a: 'Samozřejmě. Máte 14 dní na vrácení bez udání důvodu. Stačí nám napsat na reklamace@dandyswear.com a přiložíme štítek zdarma. Výměna velikosti je vždy bez poplatku.',
  },
  {
    q: 'Jak si mám vybrat velikost?',
    a: 'Střihy jsou volnější a proto doporučujeme zůstat u své obvyklé velikosti. Tabulka velikostí je u každého produktu.',
  },
  {
    q: 'Z čeho je oblečení vyrobeno?',
    a: 'Materiál produktu je vždy uvedeno pod produktem. Nejčastěji se jedná o bavlnu.',
  },
  {
    q: 'Jak se o věci starat?',
    a: 'Praní na 30 °C naruby, bez aviváže. Sušit volně rozložené na vzduchu, bubnová sušička může ničit vlákna.',
  },
  {
    q: 'Posíláte i na Slovensko nebo do zahraničí?',
    a: 'Zatím ne, ale stále pracujeme na rozšíření i do více trhů. Pokud máte zájem, napište nám na info@dandyswear.com',
  },
  {
    q: 'Jaké jsou způsoby platby?',
    a: 'Bankovní převod s QR kódem nebo dobírka. Na platební bráně se pracuje.',
  },
  {
    q: 'Mám dotaz, který zde není.',
    a: 'Napište nám na info@dandyswear.cz. Odpovídáme obvykle do 24 hodin, v nejhorším do dvou dnů. Žádný bot.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-[760px] px-6 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.24em] text-ink/50 mb-4">Časté dotazy</p>
      <h1 className="serif italic text-5xl md:text-6xl leading-[0.95] text-ink mb-10">FAQ</h1>

      <div className="space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="glass rounded-3xl overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/20 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="serif italic text-xl text-ink">{f.q}</span>
                <ChevronDown
                  size={18}
                  className={clsx('transition-transform text-ink/60 flex-shrink-0', isOpen && 'rotate-180')}
                />
              </button>
              <div
                className={clsx(
                  'grid transition-[grid-template-rows] duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-ink/80 leading-relaxed">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
