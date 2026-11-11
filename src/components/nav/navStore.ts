"use client";

import { useSyncExternalStore } from "react";

/**
 * Estado da barra de navegação controlado de fora (pela entrada 3D da etapa 5).
 * - presente: false esconde a barra (durante a entrada); true a faz entrar deslizando de cima.
 * - sobreEscuro: true deixa a barra transparente com texto branco (sobre a cena da entrada).
 */
export interface EstadoNav {
  presente: boolean;
  sobreEscuro: boolean;
}

const PADRAO: EstadoNav = { presente: true, sobreEscuro: false };

let estado: EstadoNav = PADRAO;
const ouvintes = new Set<() => void>();

export const navStore = {
  get: () => estado,
  set(parcial: Partial<EstadoNav>) {
    const novo = { ...estado, ...parcial };
    if (novo.presente === estado.presente && novo.sobreEscuro === estado.sobreEscuro) return;
    estado = novo;
    ouvintes.forEach((o) => o());
  },
  reset() {
    navStore.set(PADRAO);
  },
  subscribe(o: () => void) {
    ouvintes.add(o);
    return () => ouvintes.delete(o);
  },
};

export function useEstadoNav(): EstadoNav {
  return useSyncExternalStore(navStore.subscribe, navStore.get, () => PADRAO);
}
