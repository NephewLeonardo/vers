import type { Foto, Produto } from "./types";

/*
 * PEÇAS DA VERS
 * -------------
 * Tudo aqui é PLACEHOLDER até chegarem nomes, preços, medidas e fotos reais.
 * Nada foi inventado: os campos desconhecidos estão como null e aparecem no site
 * como [NOME DA PEÇA], [PREÇO], [MEDIDAS] e [TECIDO].
 *
 * Para cadastrar uma peça real:
 * 1. Coloque as fotos em public/pecas/<slug>/ (frente.jpg, costas.jpg, detalhe.jpg; retrato 3:4,
 *    de preferência 1800×2400 px para o zoom ficar nítido).
 * 2. Copie um item abaixo, troque slug, nome, precoCentavos, categorias, etiquetas,
 *    tamanhos, medidas, tecido, modeloVeste e o alt de cada foto.
 */

/** Fotos provisórias, iguais para todas as peças de exemplo. */
function fotosPlaceholder(n: number): Foto[] {
  const base = { width: 1800, height: 2400 } as const;
  return [
    {
      ...base,
      tipo: "frente",
      src: "/pecas/placeholder/frente.jpg",
      alt: `Foto provisória ${n}: frente da peça`,
    },
    {
      ...base,
      tipo: "costas",
      src: "/pecas/placeholder/costas.jpg",
      alt: `Foto provisória ${n}: costas da peça`,
    },
    {
      ...base,
      tipo: "detalhe",
      src: "/pecas/placeholder/detalhe.jpg",
      alt: `Foto provisória ${n}: detalhe do tecido`,
    },
  ];
}

function exemplo(n: number, dados: Pick<Produto, "categorias" | "etiquetas">): Produto {
  return {
    slug: `peca-exemplo-${n}`,
    nome: `[NOME DA PEÇA ${n}]`,
    precoCentavos: null,
    tamanhos: ["P", "M", "G"],
    fotos: fotosPlaceholder(n),
    medidas: null,
    tecido: null,
    modeloVeste: null,
    publicadoEm: "2026-11-10",
    ...dados,
  };
}

// As categorias e etiquetas abaixo só existem para testar filtros e etiquetas.
export const produtos: readonly Produto[] = [
  exemplo(1, { categorias: ["festa"], etiquetas: ["novo", "festa"] }),
  exemplo(2, { categorias: ["balada"], etiquetas: ["balada"] }),
  exemplo(3, { categorias: ["praia"], etiquetas: ["novo", "praia"] }),
  exemplo(4, { categorias: ["festa"], etiquetas: ["reveillon"] }),
  exemplo(5, { categorias: ["balada", "festa"], etiquetas: ["balada"] }),
  exemplo(6, { categorias: ["praia"], etiquetas: ["praia"] }),
];
