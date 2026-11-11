"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Foto, TipoFoto } from "@/content/types";

const NOME_TIPO: Record<TipoFoto, string> = {
  frente: "Frente",
  costas: "Costas",
  detalhe: "Detalhe do tecido",
};

/** Quanto a foto é ampliada no zoom (em relação à largura da tela). */
const AMPLIACAO = 2.5;

interface GaleriaProps {
  fotos: readonly Foto[];
  nomePeca: string;
}

/**
 * Celular: carrossel horizontal com snap. Desktop: fotos empilhadas.
 * Tocar/clicar numa foto abre o zoom em alta resolução numa janela modal (<dialog>).
 */
export function Galeria({ fotos, nomePeca }: GaleriaProps) {
  const [aberta, setAberta] = useState<number | null>(null);
  const [atual, setAtual] = useState(0);
  const trilhoRef = useRef<HTMLUListElement>(null);

  // Atualiza o contador "1 / 3" do carrossel do celular.
  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return;
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) setAtual(Number((e.target as HTMLElement).dataset.indice));
        }
      },
      { root: trilho, threshold: 0.6 },
    );
    trilho.querySelectorAll("li").forEach((li) => obs.observe(li));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative">
      <ul
        ref={trilhoRef}
        aria-label={`Fotos de ${nomePeca}`}
        className="-mx-4 flex snap-x snap-mandatory [scrollbar-width:none] overflow-x-auto sm:mx-0 lg:flex-col lg:gap-3 lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {fotos.map((foto, i) => (
          <li key={foto.src + i} data-indice={i} className="w-full shrink-0 snap-center">
            <button
              type="button"
              onClick={() => setAberta(i)}
              className="relative block aspect-[3/4] w-full cursor-zoom-in overflow-hidden bg-linha"
              aria-label={`Ampliar foto: ${NOME_TIPO[foto.tipo]}`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />
            </button>
          </li>
        ))}
      </ul>

      {fotos.length > 1 && (
        <p className="legenda pointer-events-none absolute right-3 bottom-3 rounded-pilula bg-branco/90 px-3 py-1 text-preto lg:hidden">
          <span className="sr-only">Foto </span>
          {atual + 1} / {fotos.length}
        </p>
      )}

      {aberta !== null && (
        <Zoom fotos={fotos} inicial={aberta} nomePeca={nomePeca} onFechar={() => setAberta(null)} />
      )}
    </div>
  );
}

function Zoom({
  fotos,
  inicial,
  nomePeca,
  onFechar,
}: {
  fotos: readonly Foto[];
  inicial: number;
  nomePeca: string;
  onFechar: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(inicial);
  const [ampliada, setAmpliada] = useState(false);
  /** Ponto (0–1) que deve ficar no centro depois de ampliar. */
  const focoRef = useRef({ x: 0.5, y: 0.5 });
  const foto = fotos[indice];

  // Abre como modal: o navegador prende o foco dentro e fecha com Esc.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const raiz = document.documentElement;
    const overflowAntes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    return () => {
      raiz.style.overflow = overflowAntes;
    };
  }, []);

  // Depois de ampliar, rola para deixar o ponto clicado no centro.
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area || !ampliada) return;
    area.scrollLeft = focoRef.current.x * area.scrollWidth - area.clientWidth / 2;
    area.scrollTop = focoRef.current.y * area.scrollHeight - area.clientHeight / 2;
  }, [ampliada, indice]);

  const alternar = useCallback(
    (e?: React.MouseEvent) => {
      if (!ampliada && e) {
        const r = e.currentTarget.getBoundingClientRect();
        focoRef.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
      } else if (!ampliada) {
        focoRef.current = { x: 0.5, y: 0.5 };
      }
      setAmpliada((v) => !v);
    },
    [ampliada],
  );

  // Com mouse, a foto ampliada acompanha o cursor; no toque, o arraste nativo rola.
  function acompanharMouse(e: React.PointerEvent<HTMLDivElement>) {
    if (!ampliada || e.pointerType !== "mouse") return;
    const area = e.currentTarget;
    const r = area.getBoundingClientRect();
    area.scrollLeft = ((e.clientX - r.left) / r.width) * (area.scrollWidth - area.clientWidth);
    area.scrollTop = ((e.clientY - r.top) / r.height) * (area.scrollHeight - area.clientHeight);
  }

  function ir(delta: number) {
    setAmpliada(false);
    setIndice((i) => (i + delta + fotos.length) % fotos.length);
  }

  function teclas(e: React.KeyboardEvent) {
    if (ampliada) return; // setas rolam a foto ampliada
    if (e.key === "ArrowRight") ir(1);
    if (e.key === "ArrowLeft") ir(-1);
  }

  if (!foto) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={onFechar}
      onKeyDown={teclas}
      aria-label={`Zoom: ${nomePeca}`}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-branco p-0 text-preto backdrop:bg-preto/80"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-linha px-4 py-3">
          <p className="legenda text-grafite" aria-live="polite">
            {NOME_TIPO[foto.tipo]} · {indice + 1} / {fotos.length}
          </p>
          <div className="flex gap-2">
            <button type="button" className="botao min-h-10 px-4" onClick={() => alternar()}>
              {ampliada ? "Reduzir" : "Ampliar"}
            </button>
            <button
              type="button"
              className="botao min-h-10 px-4"
              onClick={() => dialogRef.current?.close()}
              autoFocus
            >
              Fechar
            </button>
          </div>
        </div>

        <div
          ref={areaRef}
          tabIndex={ampliada ? 0 : -1}
          aria-label={ampliada ? "Foto ampliada. Use as setas para percorrer." : undefined}
          onPointerMove={acompanharMouse}
          className={`relative flex-1 ${ampliada ? "overflow-auto" : "overflow-hidden"}`}
        >
          <button
            type="button"
            onClick={alternar}
            className={`relative block ${
              ampliada ? "aspect-[3/4] cursor-zoom-out" : "h-full w-full cursor-zoom-in"
            }`}
            style={ampliada ? { width: `${AMPLIACAO * 100}%` } : undefined}
            aria-label={ampliada ? "Reduzir foto" : "Ampliar foto"}
          >
            <Image
              key={foto.src + indice}
              src={foto.src}
              alt={foto.alt}
              fill
              sizes={`${AMPLIACAO * 100}vw`}
              className={ampliada ? "object-cover" : "object-contain"}
            />
          </button>
        </div>

        {fotos.length > 1 && (
          <div className="flex justify-center gap-2 border-t border-linha px-4 py-3">
            <button type="button" className="botao min-h-10 px-4" onClick={() => ir(-1)}>
              <span aria-hidden="true">←</span> Anterior
            </button>
            <button type="button" className="botao min-h-10 px-4" onClick={() => ir(1)}>
              Próxima <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
