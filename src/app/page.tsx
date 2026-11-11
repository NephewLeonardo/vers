import { formatarPreco } from "@/lib/format";
import { getProdutos } from "@/lib/products";

/** Provisória: a entrada 3D chega na etapa 5 e a grade de produtos na etapa 3. */
export default async function Home() {
  const produtos = await getProdutos();

  return (
    <main id="conteudo" className="mx-auto max-w-7xl px-4 pt-24 pb-24 sm:px-8">
      <section id="pecas" aria-labelledby="titulo-pecas">
        <h1 id="titulo-pecas" className="text-5xl sm:text-6xl">
          Todas as peças
        </h1>
        <ul className="mt-12 divide-y divide-linha border-y border-linha">
          {produtos.map((p) => (
            <li key={p.slug} className="flex justify-between py-4 text-grafite">
              <span>{p.nome}</span>
              <span>{formatarPreco(p.precoCentavos)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
