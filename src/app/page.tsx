import { CATEGORIAS, TAMANHOS, type Categoria, type Tamanho } from "@/content/types";
import { Vitrine } from "@/components/shop/Vitrine";
import { getProdutos } from "@/lib/products";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function lerCategoria(v: unknown): Categoria | null {
  return CATEGORIAS.find((c) => c === v) ?? null;
}

function lerTamanho(v: unknown): Tamanho | null {
  return TAMANHOS.find((t) => t === v) ?? null;
}

/** A entrada 3D chega na etapa 5; por enquanto a página abre direto na vitrine. */
export default async function Home({ searchParams }: PageProps) {
  const [produtos, params] = await Promise.all([getProdutos(), searchParams]);

  return (
    <main id="conteudo" className="mx-auto max-w-7xl px-4 pt-36 pb-24 sm:px-8 sm:pt-44">
      <section id="pecas" aria-labelledby="titulo-pecas" className="scroll-mt-28">
        <header className="mb-10 flex flex-col gap-4 sm:mb-14">
          <p className="legenda text-cinza-texto">Vitrine</p>
          <h1 id="titulo-pecas" className="text-5xl sm:text-7xl">
            Todas as peças
          </h1>
        </header>

        <Vitrine
          key={`${params.categoria ?? ""}-${params.tamanho ?? ""}`}
          produtos={produtos}
          inicial={{
            categoria: lerCategoria(params.categoria),
            tamanho: lerTamanho(params.tamanho),
          }}
        />
      </section>
    </main>
  );
}
