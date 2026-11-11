import { headers } from "next/headers";
import { CATEGORIAS, TAMANHOS, type Categoria, type Tamanho } from "@/content/types";
import { CenaCampanha } from "@/components/entrada/CenaCampanha";
import { Entrada } from "@/components/entrada/Entrada";
import { ScriptEntrada } from "@/components/entrada/ScriptEntrada";
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

export default async function Home({ searchParams }: PageProps) {
  const [produtos, params, cabecalhos] = await Promise.all([
    getProdutos(),
    searchParams,
    headers(),
  ]);
  const nonce = cabecalhos.get("x-nonce") ?? undefined;

  return (
    <>
      <ScriptEntrada nonce={nonce} />
      <Entrada cena={<CenaCampanha />} idVitrine="vitrine" idTituloVitrine="titulo-pecas" />

      {/* A vitrine sobe por cima da última tela da entrada (margem negativa aplicada via JS). */}
      <div id="vitrine" className="relative z-10 bg-branco">
        <main id="conteudo" className="mx-auto max-w-7xl px-4 pt-36 pb-24 sm:px-8 sm:pt-44">
          <section id="pecas" aria-labelledby="titulo-pecas" className="scroll-mt-28">
            <header className="mb-10 flex flex-col gap-4 sm:mb-14">
              <p className="legenda text-cinza-texto">Vitrine</p>
              <h1 id="titulo-pecas" tabIndex={-1} className="text-5xl outline-none sm:text-7xl">
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
      </div>
    </>
  );
}
