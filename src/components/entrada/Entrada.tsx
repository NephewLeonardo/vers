"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";
import { navStore } from "@/components/nav/navStore";
import { rolarPara } from "@/lib/rolagem";
import { CHAVE_SESSAO } from "./ScriptEntrada";
import { PONTO_ZOOM, RAIO_ZOOM, V_ALTURA, V_LARGURA, V_PATH } from "./v-path";

gsap.registerPlugin(ScrollTrigger);

/** Tamanho do V na abertura (fração da altura da tela), igual ao CSS de .entrada. */
const ALTURA_V = { desktop: 0.62, celular: 0.5 };
/** Largura máxima do V (fração da largura da tela). */
const LARGURA_MAX_V = 0.78;
/** Deslocamento do V para cima, abrindo espaço para "VERS / Role para entrar". */
const SUBIDA_V = 0.04;
/**
 * Folga da ampliação final. Com 1,6 o recorte já cobre a tela por volta de 85% do zoom,
 * então as bordas inclinadas do V saem de cena antes do fim (nada de faixas pretas tortas).
 */
const FOLGA_ZOOM = 1.6;
/** Duração da entrada em telas de rolagem (a última tela é a vitrine subindo). */
const TELAS = { completa: 4, curta: 2 };

function marcarVista() {
  try {
    sessionStorage.setItem(CHAVE_SESSAO, "1");
  } catch {
    /* modo privado: tudo bem */
  }
}

interface EntradaProps {
  /** Cena de campanha (renderizada no servidor). */
  cena: React.ReactNode;
  /** Id do elemento que vem logo depois (a vitrine), que sobe por cima da cena no final. */
  idVitrine: string;
  /** Id do título da vitrine, que recebe o foco ao pular a entrada. */
  idTituloVitrine: string;
}

export function Entrada({ cena, idVitrine, idTituloVitrine }: EntradaProps) {
  const raizRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const grupoRef = useRef<SVGGElement>(null);
  const furoRef = useRef<SVGPathElement>(null);
  const pularRef = useRef<() => void>(() => {});
  const [mostrarPular, setMostrarPular] = useState(true);

  useLayoutEffect(() => {
    const html = document.documentElement;
    const raiz = raizRef.current;
    const svg = svgRef.current;
    const grupo = grupoRef.current;
    const furo = furoRef.current;
    const vitrine = document.getElementById(idVitrine);
    if (!raiz || !svg || !grupo || !furo || !vitrine) return;

    const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Navegação interna para /#pecas (o script inline só roda no carregamento completo).
    if (window.location.hash) html.setAttribute("data-entrada-pular", "");

    if (reduzMovimento || html.hasAttribute("data-entrada-pular")) {
      navStore.reset();
      return () => html.removeAttribute("data-entrada-pular");
    }

    try {
      if (sessionStorage.getItem(CHAVE_SESSAO)) html.setAttribute("data-entrada-curta", "");
    } catch {
      /* ignora */
    }
    const curta = html.hasAttribute("data-entrada-curta");
    const telas = curta ? TELAS.curta : TELAS.completa;
    /** Progresso em que a cena termina e a vitrine começa a subir. */
    const S = (telas - 1) / telas;

    navStore.set({ presente: false, sobreEscuro: true });

    // ---------- Geometria do V ----------
    let vw = 0;
    let vh = 0;
    let base = 1; // escala do glifo na abertura
    let p0x = 0; // posição inicial do ponto de zoom na tela
    let p0y = 0;
    let fator = 1; // ampliação total até o recorte cobrir a tela
    const estado = { z: 0 };

    function medir() {
      if (!raiz || !svg || !vitrine) return;
      vw = raiz.clientWidth;
      vh = raiz.clientHeight;
      const celular = window.matchMedia("(max-width: 767px)").matches;
      const alturaV = Math.min(
        vh * (celular ? ALTURA_V.celular : ALTURA_V.desktop),
        ((vw * LARGURA_MAX_V) / V_LARGURA) * V_ALTURA,
      );
      base = alturaV / V_ALTURA;
      const ox = (vw - V_LARGURA * base) / 2;
      const oy = (vh - V_ALTURA * base) / 2 - vh * SUBIDA_V;
      p0x = ox + PONTO_ZOOM.x * base;
      p0y = oy + PONTO_ZOOM.y * base;
      // O círculo inscrito no traço precisa cobrir a tela inteira (meia diagonal × folga).
      const escalaFinal = ((Math.hypot(vw, vh) / 2) * FOLGA_ZOOM) / RAIO_ZOOM;
      fator = escalaFinal / base;
      svg.setAttribute("viewBox", `0 0 ${vw} ${vh}`);
      // A vitrine sobe por cima da última tela da entrada.
      vitrine.style.marginTop = `${-vh}px`;
      desenhar();
    }

    /** Zoom exponencial: escala = base × fator^z (velocidade percebida constante). */
    function desenhar() {
      if (!grupo || !furo) return;
      const z = estado.z;
      const s = base * Math.pow(fator, z);
      const m = z * z * (3 - 2 * z); // o ponto de zoom migra suave para o centro
      const px = p0x + (vw / 2 - p0x) * m;
      const py = p0y + (vh / 2 - p0y) * m;
      const tx = px - PONTO_ZOOM.x * s;
      const ty = py - PONTO_ZOOM.y * s;
      grupo.setAttribute("transform", `matrix(${s} 0 0 ${s} ${tx} ${ty})`);
      // Retângulo preto da tela em coordenadas do glifo + o V: com evenodd, o V vira um furo.
      const x0 = -tx / s - 2;
      const y0 = -ty / s - 2;
      const x1 = (vw - tx) / s + 2;
      const y1 = (vh - ty) / s + 2;
      furo.setAttribute("d", `M${x0} ${y0}H${x1}V${y1}H${x0}Z${V_PATH}`);
    }

    html.setAttribute("data-entrada-ativa", "");
    raiz.setAttribute("data-pronta", "");
    medir();
    ScrollTrigger.addEventListener("refreshInit", medir);

    let chegou = false;
    let pularVisivel = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: raiz,
          start: "top top",
          end: () => `+=${telas * raiz.offsetHeight}`,
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate(self) {
            const p = self.progress;
            const naVitrine = p > 0.97;
            if (naVitrine && !chegou) {
              chegou = true;
              marcarVista();
            }
            // A barra entra deslizando quando a vitrine assenta; sobre a cena fica transparente.
            if (chegou) navStore.set({ presente: true, sobreEscuro: !naVitrine });
            const pular = p < S;
            if (pular !== pularVisivel) {
              pularVisivel = pular;
              setMostrarPular(pular);
            }
          },
        },
      });

      const cena = S; // duração da cena no tempo da timeline
      const zoom = 0.55 * cena;

      // 1. Abertura → mergulho: a dica e o traço somem, o V amplia exponencialmente.
      tl.to("[data-dica]", { autoAlpha: 0, duration: 0.06 * cena }, 0)
        .to("[data-v-traco]", { opacity: 0, duration: 0.15 * cena }, 0.02 * cena)
        .to(estado, { z: 1, duration: zoom, onUpdate: desenhar }, 0)
        .set(svg, { autoAlpha: 0 }, zoom)
        // A cena já cobre a tela: o fundo vira branco sem ninguém ver, e o afastamento
        // final revela branco (nunca uma moldura preta).
        .set(raiz, { backgroundColor: "#ffffff" }, zoom);

      // 2. Cena em 3 camadas, cada uma numa velocidade (profundidade).
      tl.fromTo("[data-camada=fundo]", { scale: 1.35 }, { scale: 1.1, duration: zoom }, 0)
        .to("[data-camada=fundo]", { scale: 1.2, duration: cena - zoom }, zoom)
        .fromTo(
          "[data-camada=modelo]",
          { scale: 1.6, yPercent: 10 },
          { scale: 1.06, yPercent: 0, duration: zoom },
          0,
        )
        .to("[data-camada=modelo]", { scale: 1.3, yPercent: -2, duration: cena - zoom }, zoom)
        .fromTo(
          "[data-camada=frase]",
          { autoAlpha: 0, scale: 1.6 },
          { autoAlpha: 1, scale: 1, duration: 0.3 * cena },
          0.25 * cena,
        )
        .to("[data-camada=frase]", { scale: 1.12, duration: cena - 0.55 * cena }, 0.55 * cena);

      // 3. Chegada: a cena se afasta e clareia enquanto a vitrine sobe e assenta.
      tl.to("[data-cena]", { scale: 0.92, duration: 1 - S, ease: "power1.inOut" }, S).fromTo(
        "[data-veu]",
        { opacity: 0 },
        { opacity: 0.9, duration: 1 - S, ease: "sine.inOut" },
        S,
      );

      pularRef.current = () => {
        marcarVista();
        const st = tl.scrollTrigger;
        if (!st) return;
        rolarPara(st.end, true);
        st.getTween()?.progress(1);
        tl.progress(1);
        chegou = true;
        navStore.set({ presente: true, sobreEscuro: false });
        document.getElementById(idTituloVitrine)?.focus({ preventScroll: true });
      };
    }, raiz);

    return () => {
      ctx.revert();
      ScrollTrigger.removeEventListener("refreshInit", medir);
      vitrine.style.marginTop = "";
      raiz.removeAttribute("data-pronta");
      html.removeAttribute("data-entrada-ativa");
      html.removeAttribute("data-entrada-curta");
      navStore.reset();
    };
  }, [idVitrine, idTituloVitrine]);

  return (
    <section
      ref={raizRef}
      data-entrada
      aria-label="Abertura"
      className="entrada relative z-0 h-lvh overflow-hidden bg-preto"
    >
      {cena}

      <svg
        ref={svgRef}
        aria-hidden="true"
        className="mascara"
        viewBox={`0 0 ${V_LARGURA} ${V_ALTURA}`}
      >
        <g ref={grupoRef}>
          <path ref={furoRef} fill="#000" fillRule="evenodd" d="" />
          <path className="v-tampa" d={V_PATH} fill="#000" />
          <path
            data-v-traco
            className="v-traco"
            d={V_PATH}
            fill="none"
            stroke="#fff"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
          />
        </g>
      </svg>

      <div
        data-dica
        className="entrada-dica pointer-events-none absolute inset-x-0 flex flex-col items-center gap-3 text-branco"
      >
        <p className="legenda tracking-[0.6em]" aria-hidden="true">
          Vers
        </p>
        <p className="legenda text-cinza">Role para entrar</p>
        <span aria-hidden="true" className="entrada-linha mt-2 block h-10 w-px bg-branco/60" />
      </div>

      {mostrarPular && (
        <button
          type="button"
          onClick={() => pularRef.current()}
          className="legenda absolute top-4 right-4 z-10 min-h-11 rounded-pilula border border-branco/40 px-5 text-branco/80 transition-colors duration-300 hover:border-branco hover:text-branco sm:top-6 sm:right-8"
        >
          Pular intro
        </button>
      )}
    </section>
  );
}
