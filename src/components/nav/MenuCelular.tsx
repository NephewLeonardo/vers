"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { LinkInstagram } from "@/components/layout/LinkInstagram";
import { Logo } from "@/components/layout/Logo";
import { site } from "@/lib/site";
import { LINKS_DIREITA, LINKS_ESQUERDA } from "./links";

interface MenuCelularProps {
  aberto: boolean;
  onFechar: () => void;
}

/**
 * Painel em tela cheia do celular. Usa <dialog> modal: o navegador prende o foco
 * dentro, deixa o resto da página inerte e fecha com Esc.
 */
export function MenuCelular({ aberto, onFechar }: MenuCelularProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (aberto && !dialog.open) dialog.showModal();
    if (!aberto && dialog.open) dialog.close();

    if (!aberto) return;
    const raiz = document.documentElement;
    const antes = raiz.style.overflow;
    raiz.style.overflow = "hidden";
    return () => {
      raiz.style.overflow = antes;
    };
  }, [aberto]);

  // Se a tela crescer para desktop com o menu aberto, fecha.
  useEffect(() => {
    if (!aberto) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const aoMudar = () => mq.matches && onFechar();
    mq.addEventListener("change", aoMudar);
    return () => mq.removeEventListener("change", aoMudar);
  }, [aberto, onFechar]);

  const linkGrande =
    "block py-2 font-serif text-5xl leading-tight font-normal italic text-preto transition-opacity duration-300 hover:opacity-60";

  return (
    <dialog
      ref={ref}
      id="menu-celular"
      data-lenis-prevent
      aria-label="Menu"
      onClose={onFechar}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-branco p-0 text-preto opacity-100 transition-opacity duration-300 ease-vers backdrop:bg-transparent motion-reduce:transition-none starting:opacity-0"
    >
      <div className="flex h-full flex-col px-4 sm:px-8">
        <div className="grid h-nav grid-cols-[1fr_auto_1fr] items-center">
          <button
            type="button"
            onClick={onFechar}
            className="-ml-2 inline-flex size-11 items-center justify-center"
            autoFocus
          >
            <span className="sr-only">Fechar menu</span>
            <span aria-hidden="true" className="relative block size-5">
              <span className="absolute top-1/2 left-0 h-px w-full rotate-45 bg-current" />
              <span className="absolute top-1/2 left-0 h-px w-full -rotate-45 bg-current" />
            </span>
          </button>
          <Logo className="px-4 text-2xl" />
          <span />
        </div>

        <nav aria-label="Menu" className="flex flex-1 flex-col justify-center">
          <ul className="flex flex-col gap-1">
            {[...LINKS_ESQUERDA, ...LINKS_DIREITA].map((l) => (
              <li key={l.label}>
                <Link href={l.href} onClick={onFechar} className={linkGrande}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <LinkInstagram className={linkGrande}>Instagram</LinkInstagram>
            </li>
          </ul>
        </nav>

        <p className="legenda border-t border-linha py-6 text-cinza-texto">{site.tagline}</p>
      </div>
    </dialog>
  );
}
