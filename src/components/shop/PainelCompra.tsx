"use client";

import { useId, useRef, useState } from "react";
import { PLACEHOLDER, type Medidas, type Produto, type Tamanho } from "@/content/types";
import { site } from "@/lib/site";

const LINHAS_MEDIDAS: { chave: keyof Medidas; nome: string }[] = [
  { chave: "busto", nome: "Busto" },
  { chave: "cintura", nome: "Cintura" },
  { chave: "quadril", nome: "Quadril" },
  { chave: "comprimento", nome: "Comprimento" },
];

interface PainelCompraProps {
  produto: Pick<Produto, "nome" | "tamanhos" | "esgotados" | "medidas">;
  /** Endereço completo da página da peça, incluído na mensagem do Direct. */
  urlPeca: string;
}

export function PainelCompra({ produto, urlPeca }: PainelCompraProps) {
  const [tamanho, setTamanho] = useState<Tamanho | null>(null);
  const [erro, setErro] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const grupoRef = useRef<HTMLFieldSetElement>(null);
  const idErro = useId();
  const idAviso = useId();
  const esgotados = new Set(produto.esgotados ?? []);

  const mensagem = tamanho
    ? `Oi, Vers! Quero a peça "${produto.nome}" no tamanho ${tamanho}. ${urlPeca}`
    : "";

  function pedir(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!tamanho) {
      e.preventDefault();
      setErro(true);
      grupoRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
      return;
    }
    // O Instagram não aceita texto pré-preenchido por link: copiamos a mensagem
    // e o link segue abrindo o Direct normalmente (sem bloqueio de pop-up).
    const copiar = navigator.clipboard?.writeText(mensagem);
    if (copiar) {
      copiar.then(
        () => setAviso("Mensagem copiada. No Direct, é só colar e enviar."),
        () => setAviso(`Não deu para copiar. Envie no Direct: ${mensagem}`),
      );
    } else {
      setAviso(`Envie no Direct: ${mensagem}`);
    }
  }

  const temMedidas = produto.medidas !== null;

  return (
    <div className="flex flex-col gap-10">
      <fieldset ref={grupoRef} aria-describedby={erro ? idErro : undefined}>
        <legend className="legenda text-cinza-texto">Tamanho</legend>
        <div className="mt-4 flex gap-2">
          {produto.tamanhos.map((t) => {
            const esgotado = esgotados.has(t);
            return (
              <label key={t} className={esgotado ? "cursor-not-allowed" : "cursor-pointer"}>
                <input
                  type="radio"
                  name="tamanho"
                  value={t}
                  disabled={esgotado}
                  checked={tamanho === t}
                  onChange={() => {
                    setTamanho(t);
                    setErro(false);
                    setAviso(null);
                  }}
                  className="peer sr-only"
                />
                <span className="flex size-12 items-center justify-center rounded-pilula border border-linha text-sm text-grafite transition-colors duration-300 ease-vers peer-checked:border-preto peer-checked:bg-preto peer-checked:text-branco peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-preto peer-disabled:text-cinza-texto peer-disabled:line-through hover:border-preto peer-disabled:hover:border-linha">
                  {t}
                  {esgotado && <span className="sr-only"> (esgotado)</span>}
                </span>
              </label>
            );
          })}
        </div>
        {erro && (
          <p id={idErro} className="mt-3 text-sm text-preto" role="alert">
            Escolha um tamanho para pedir pelo Direct.
          </p>
        )}
      </fieldset>

      <div>
        <a
          href={site.instagram.directUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={pedir}
          aria-describedby={aviso ? idAviso : undefined}
          className="botao w-full bg-preto text-branco hover:bg-branco hover:text-preto"
        >
          Quero esta peça · pedir pelo Direct
          <span className="sr-only"> (abre o Instagram em nova aba)</span>
        </a>
        <p id={idAviso} className="mt-3 min-h-5 text-sm text-grafite" role="status">
          {aviso}
        </p>
      </div>

      <section aria-labelledby="titulo-medidas">
        <h2 id="titulo-medidas" className="legenda font-sans text-cinza-texto not-italic">
          Medidas da peça (cm)
        </h2>
        {temMedidas ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-linha">
                  <th scope="col" className="py-2 text-left font-normal text-cinza-texto">
                    <span className="sr-only">Medida</span>
                  </th>
                  {produto.tamanhos.map((t) => (
                    <th
                      key={t}
                      scope="col"
                      className={`py-2 text-center font-normal ${
                        tamanho === t ? "text-preto underline underline-offset-4" : "text-grafite"
                      }`}
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LINHAS_MEDIDAS.filter(({ chave }) =>
                  produto.tamanhos.some((t) => produto.medidas?.[t]?.[chave] !== undefined),
                ).map(({ chave, nome }) => (
                  <tr key={chave} className="border-b border-linha">
                    <th scope="row" className="py-2 text-left font-normal text-grafite">
                      {nome}
                    </th>
                    {produto.tamanhos.map((t) => (
                      <td
                        key={t}
                        className={`py-2 text-center ${tamanho === t ? "text-preto" : "text-grafite"}`}
                      >
                        {produto.medidas?.[t]?.[chave] ?? "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-grafite">{PLACEHOLDER.medidas}</p>
        )}
      </section>
    </div>
  );
}
