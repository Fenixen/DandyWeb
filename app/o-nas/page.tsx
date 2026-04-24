export const metadata = { title: "O nás — Dandy's Wear" };

export default function ONas() {
  return (
    <article className="mx-auto max-w-[720px] px-6 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.24em] text-ink/50 mb-6">O nás</p>
      <h1 className="serif italic text-5xl md:text-6xl leading-[0.95] text-ink">
        Značka inspirovaná.<br />
        pejskem Dandy.
      </h1>

      <div className="prose-dandy mt-10 text-ink/85 text-[17px]">
        <p>
          Dandy&apos;s Wear vzniklo v roce 2024. v malém pražském ateliéru, kde jsme
          kreslili střihy na balicí papír a první trička žehlili v kuchyni.
          Věřili jsme, že oblečení se dá dělat s péčí — jeden kus po druhém,
          bez spěchu, bez sezón, bez kompromisů.
        </p>

        <h2>Co děláme jinak</h2>
        <p>
          Všechny naše kousky šijeme v malosériích v české dílně, se kterou
          spolupracujeme dlouhodobě. Používáme přírodní a recyklované materiály —
          bavlnu, len, vlnu. Žádné umělé směsi, žádná rychlá móda, žádné chemicky
          upravené povrchy.
        </p>

        <h2>Proč béžová a cihla</h2>
        <p>
          Protože jsou to barvy, které se nevyptávají. Doplňují, nepřeřvávají.
          Naše paleta je inspirovaná barvami pražských fasád po dešti,
          opotřebovaným papírem starých dopisů a teplem podzimního slunce.
        </p>

        <h2>Náš slib</h2>
        <p>
          Každý kus od nás vydrží roky. Pokud se něco pokazí, spravíme to.
          Pokud vám nebude sedět velikost, vyměníme. A pokud máte otázku,
          odpovíme osobně, ne z chatbota.
        </p>

        <p className="serif italic text-2xl mt-12">
          S úctou k detailu,<br />— tým Dandy&apos;s Wear
        </p>
      </div>
    </article>
  );
}
