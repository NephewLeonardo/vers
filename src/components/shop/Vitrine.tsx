"use client";

import { useId, useMemo, useState } from "react";
import { CATEGORIAS, TAMANHOS, type Categoria, type Produto, type Tamanho } from "@/content/types";
import { ProductCard } from "./ProductCard";

const NOMES_CATEGORIA: Record<Categoria, string> = {
  festa: "Festa",
  balada: "Balada",
  praia: "Praia",
};

export interface FiltroInicial {
  categoria: Categoria | null;
  tamanho: Tamanho | null;
}

interface VitrineProps {
  produtos: Produto[];
  inicial: FiltroInicial;
}

/** Atualiza ?categoria=&tamanho= sem recarregar e sem rolar a página. */
function sincronizarUrl({ categoria, tamanho }: FiltroInicial) {
  const url = new URL(window.location.href);
  if (categoria) url.searchParams.set("categoria", categoria);
  else url.searchParams.delete("categoria");
  if (tamanho) url.searchParams.set("tamanho", tamanho);
  else url.searchParams.delete("tamanho");
  window.history.replaceState(window.history.state, "", url);
}

function Pilula({
  ativa,
  onClick,
  children,
  controls,
  expanded,
}: {
  ativa: boolean;
  onClick: () => void;
  children: React.ReactNode;
  controls?: string;
  expanded?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={expanded === undefined ? ativa : undefined}
      aria-expanded={expanded}
      aria-controls={controls}
      className={`legenda min-h-11 rounded-pilula border px-5 transition-colors duration-300 ease-vers ${
        ativa
          ? "border-preto bg-preto text-branco"
          : "border-linha text-grafite hover:border-preto hover:text-preto"
      }`}
    >
      {children}
    </button>
  );
}

export function Vitrine({ produtos, inicial }: VitrineProps) {
  const [categoria, setCategoria] = useState<Categoria | null>(inicial.categoria);
  const [tamanho, setTamanho] = useState<Tamanho | null>(inicial.tamanho);
  const [tamanhosAbertos, setTamanhosAbertos] = useState(inicial.tamanho !== null);
  const idTamanhos = useId();

  const visiveis = useMemo(
    () =>
      produtos.filter(
        (p) =>
          (!categoria || p.categorias.includes(categoria)) &&
          (!tamanho || (p.tamanhos.includes(tamanho) && !p.esgotados?.includes(tamanho))),
      ),
    [produtos, categoria, tamanho],
  );

  function escolherCategoria(c: Categoria | null) {
    setCategoria(c);
    sincronizarUrl({ categoria: c, tamanho });
  }

  function escolherTamanho(t: Tamanho | null) {
    setTamanho(t);
    sincronizarUrl({ categoria, tamanho: t });
  }

  return (
    <>
      <div className="flex flex-col gap-3" role="group" aria-label="Filtrar peças">
        <div className="flex flex-wrap gap-2">
          <Pilula ativa={categoria === null} onClick={() => escolherCategoria(null)}>
            Todas
          </Pilula>
          {CATEGORIAS.map((c) => (
            <Pilula key={c} ativa={categoria === c} onClick={() => escolherCategoria(c)}>
              {NOMES_CATEGORIA[c]}
            </Pilula>
          ))}
          <Pilula
            ativa={tamanho !== null}
            expanded={tamanhosAbertos}
            controls={idTamanhos}
            onClick={() => setTamanhosAbertos((v) => !v)}
          >
            Tamanho{tamanho ? `: ${tamanho}` : ""}
          </Pilula>
        </div>

        <div
          id={idTamanhos}
          hidden={!tamanhosAbertos}
          role="group"
          aria-label="Tamanho"
          className="flex flex-wrap gap-2"
        >
          <Pilula ativa={tamanho === null} onClick={() => escolherTamanho(null)}>
            Todos
          </Pilula>
          {TAMANHOS.map((t) => (
            <Pilula key={t} ativa={tamanho === t} onClick={() => escolherTamanho(t)}>
              {t}
            </Pilula>
          ))}
        </div>
      </div>

      <p className="legenda mt-8 text-cinza-texto" role="status" aria-live="polite">
        {visiveis.length === 1 ? "1 peça" : `${visiveis.length} peças`}
      </p>

      {visiveis.length > 0 ? (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {visiveis.map((p) => (
            <li key={p.slug}>
              <ProductCard produto={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-6 border-t border-linha pt-10">
          <p className="text-grafite">Nenhuma peça com esses filtros por enquanto.</p>
          <button
            type="button"
            className="botao"
            onClick={() => {
              setCategoria(null);
              setTamanho(null);
              sincronizarUrl({ categoria: null, tamanho: null });
            }}
          >
            Limpar filtros
          </button>
        </div>
      )}
    </>
  );
}
