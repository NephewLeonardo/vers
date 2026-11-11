import { PLACEHOLDER } from "@/content/types";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 18990 → "R$ 189,90"; null → "[PREÇO]". */
export function formatarPreco(centavos: number | null): string {
  return centavos === null ? PLACEHOLDER.preco : brl.format(centavos / 100);
}

const NOMES_ETIQUETA = {
  novo: "Novo",
  festa: "Festa",
  balada: "Balada",
  praia: "Praia",
  reveillon: "Réveillon",
} as const;

export function nomeEtiqueta(e: keyof typeof NOMES_ETIQUETA): string {
  return NOMES_ETIQUETA[e];
}
