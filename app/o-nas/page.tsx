export const metadata = { title: "O nás — Dandy's Wear" };

export default function ONas() {
  return (
    <article className="mx-auto max-w-[720px] px-6 py-12 md:py-20">
      <p className="text-xs uppercase tracking-[0.24em] text-ink/50 mb-6">O nás</p>
      <h1 className="serif italic text-5xl md:text-5xl leading-[0.95] text-ink">
        Nenosíte normální oblečení, nosíte příběh
      </h1>

      <div className="prose-dandy mt-10 text-ink/85 text-[17px]">
        <h2>Začátek</h2>
        <p>
          Za značkou <b>Dandy's Wear</b> se skrývá příběh, který je nám velmi blízký. Příběh jedné výjimečné fenky
          jménem <b>Dandy</b>. Dandy se narodila v Českém Brodě, ale svůj život strávila na Brněnsku. Byla to dáma s osobností,
          veselá, zvídavá a vždy připravená být u všeho jako první. Její energie, radost ze života a trocha té "psí rošťárny"
          byly nakažlivé. Stala se nejen milovaným členem rodiny, ale také inspirací něčeho většího.
        </p>

        <h2>Jak to šlo dál</h2>
        <p>
          Během svého života čelila několika zdravotním výzvám, především virovým onemocněním. Vždy však bojovala statečně,
          s noblesou sobě vlastní. Když jí bylo něco málo přes osm let, byla jí diagnostikována vážná nemoc. Přesto si uchovala
          svůj charakter laskavý pohled, důvěru v lidi a oddanost. Nakonec ale nemoc zvítezila a Dandy nás ve věku devíti let
          opustila.
        </p>

        <h2>Její duch však žije dál</h2>
        <p>
          Dandy se stala symbolem naší značky, ztělesněním elegance, síly a přirozené radosti ze života. <b>Dandy's Wear</b> je
          poctou jejímu odkazu. Vytváříme oblečení, které nese podobné hodnoty: <b>čistý styl, kvalitu, nadčasovost a špetku
            osobité noblesy
          </b>. Naše kousky jsou navržené s důrazem na detail tak, aby se v nich každý cítil výjimečně, a přesto přirozeně.
          Stejně jako <b>Dandy</b>.
        </p>
        <h2>Každý nákup pomáhá</h2>
        <p>
          <b>Buďte součástí něčeho velkého</b>
          Dandy nás naučila mnohému, mimo jiné i tomu, jak důležité je neztrácet naději, i když život přináší těžké
          chvíle.<br/>Proto jsme se rozhodli, že <b>každým nákupem přispíváte na výzkum léčby závažných onemocnění</b>,
          která stále čekají na svá řešení.<b> Z Každé objednávky věnujeme 2% na podporu odborníků, kteří pracují na tom,
            aby jednou mohli dát šanci na uzdravení těm, kteří ji nejvíce potřebují.
          </b><br/>Děkujeme, že v tom jdete s námi. I malý krok může znamenat velkou změnu.
        </p>

        <p className="serif text-2xl mt-12">
          Ať žijeme na planetě, kde tato zákeřná nemoc už není.
        </p>

        <h3>Odkaz na nadaci</h3>
        <a href='https://worldwidecancerresearch.org' target="_blank">Worldwide cancer research</a>

      </div>
    </article>
  );
}
