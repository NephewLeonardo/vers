"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LinkInstagram } from "@/components/layout/LinkInstagram";
import { Logo } from "@/components/layout/Logo";
import { LINKS_DIREITA, LINKS_ESQUERDA } from "./links";
import { MenuCelular } from "./MenuCelular";
import { useEstadoNav } from "./navStore";

/** A partir de quantos px rolados a barra fica sólida. */
const LIMITE_SOLIDA = 8;
/** Abaixo desta posição a barra nunca se esconde. */
const LIMITE_ESCONDER = 160;
/** Variação mínima de rolagem para trocar de direção (evita tremer). */
const TOLERANCIA = 6;

interface NavProps {
  /** Faixa de aviso exibida acima da barra (renderizada no servidor). */
  faixa: React.ReactNode;
}

export function Nav({ faixa }: NavProps) {
  const pathname = usePathname();
  const { presente, sobreEscuro } = useEstadoNav();
  const [rolou, setRolou] = useState(false);
  const [recolhida, setRecolhida] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Some ao rolar para baixo, reaparece ao rolar para cima.
  useEffect(() => {
    let ultimo = window.scrollY;
    let agendado = false;

    function atualizar() {
      agendado = false;
      const y = window.scrollY;
      setRolou(y > LIMITE_SOLIDA);
      const delta = y - ultimo;
      if (Math.abs(delta) < TOLERANCIA) return;
      // Não esconde se o foco do teclado estiver dentro da barra.
      const focoDentro = headerRef.current?.contains(document.activeElement) ?? false;
      setRecolhida(delta > 0 && y > LIMITE_ESCONDER && !focoDentro);
      ultimo = y;
    }

    function aoRolar() {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(atualizar);
    }

    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  const escondida = !presente || (recolhida && !menuAberto);
  const solida = rolou && !sobreEscuro;
  const claro = sobreEscuro && !solida; // texto branco sobre a cena escura

  const corTexto = claro ? "text-branco" : "text-preto";
  const corLink = claro ? "text-branco/80 hover:text-branco" : "text-grafite hover:text-preto";
  const linkClasse = `legenda inline-flex min-h-11 items-center transition-colors duration-300 ${corLink}`;

  function atual(href: string) {
    return href === pathname ? ("page" as const) : undefined;
  }

  return (
    <>
      <header
        ref={headerRef}
        onFocus={() => setRecolhida(false)}
        inert={!presente}
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-vers will-change-transform motion-reduce:transition-none ${
          escondida ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {faixa}

        <div
          className={`border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-vers ${
            solida
              ? "border-linha bg-branco/80 backdrop-blur-md backdrop-saturate-150"
              : "border-transparent bg-transparent"
          } ${corTexto}`}
        >
          <nav
            aria-label="Principal"
            className="mx-auto grid h-nav max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8"
          >
            {/* Esquerda: hambúrguer no celular, categorias no desktop */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setMenuAberto(true)}
                aria-expanded={menuAberto}
                aria-controls="menu-celular"
                className="-ml-2 inline-flex size-11 items-center justify-center lg:hidden"
              >
                <span className="sr-only">Abrir menu</span>
                <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                </span>
              </button>
              <ul className="hidden items-center gap-7 lg:flex">
                {LINKS_ESQUERDA.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className={linkClasse}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Logo href="/" className="px-4 text-2xl" />

            {/* Direita */}
            <ul className="hidden items-center justify-end gap-7 lg:flex">
              {LINKS_DIREITA.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} aria-current={atual(l.href)} className={linkClasse}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <LinkInstagram className={linkClasse}>Instagram</LinkInstagram>
              </li>
            </ul>
            <div className="lg:hidden" aria-hidden="true" />
          </nav>
        </div>
      </header>

      <MenuCelular aberto={menuAberto} onFechar={() => setMenuAberto(false)} />
    </>
  );
}
