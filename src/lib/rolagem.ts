import type Lenis from "lenis";

/** Instância única do Lenis (rolagem suave), criada por <SmoothScroll />. */
let instancia: Lenis | null = null;

export function definirLenis(l: Lenis | null) {
  instancia = l;
}

export function getLenis(): Lenis | null {
  return instancia;
}

/** Rola até uma posição (px), com ou sem Lenis. */
export function rolarPara(y: number, imediato = false) {
  if (instancia) instancia.scrollTo(y, { immediate: imediato, force: true });
  else window.scrollTo({ top: y, behavior: imediato ? "instant" : "smooth" });
}
