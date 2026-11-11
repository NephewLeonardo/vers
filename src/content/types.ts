/**
 * Formato das peças. As páginas dependem SÓ destes tipos (via src/lib/products.ts),
 * então trocar o arquivo local por um CMS headless não exige refazer páginas.
 */

export const CATEGORIAS = ["festa", "balada", "praia"] as const;
export type Categoria = (typeof CATEGORIAS)[number];

export const ETIQUETAS = ["novo", "festa", "balada", "praia", "reveillon"] as const;
export type Etiqueta = (typeof ETIQUETAS)[number];

export const TAMANHOS = ["P", "M", "G"] as const;
export type Tamanho = (typeof TAMANHOS)[number];

export type TipoFoto = "frente" | "costas" | "detalhe";

export interface Foto {
  /** Caminho em /public ou URL de domínio liberado em next.config (images.remotePatterns). */
  src: string;
  /** Texto alternativo descrevendo a roupa (obrigatório). */
  alt: string;
  width: number;
  height: number;
  tipo: TipoFoto;
}

/** Medidas da peça em centímetros. Só preencha o que fizer sentido para a peça. */
export interface Medidas {
  busto?: number;
  cintura?: number;
  quadril?: number;
  comprimento?: number;
}

export interface Produto {
  /** Identificador na URL: /peca/<slug>. */
  slug: string;
  nome: string;
  /** Preço em centavos (ex.: 18990 = R$ 189,90). null enquanto não houver preço. */
  precoCentavos: number | null;
  categorias: readonly Categoria[];
  etiquetas: readonly Etiqueta[];
  /** Tamanhos em que a peça existe; os esgotados ficam em `esgotados`. */
  tamanhos: readonly Tamanho[];
  esgotados?: readonly Tamanho[];
  /** Ordem: frente, costas, detalhe do tecido. A primeira é a capa. */
  fotos: readonly Foto[];
  /** Medidas por tamanho; null enquanto não houver medidas. */
  medidas: Partial<Record<Tamanho, Medidas>> | null;
  tecido: string | null;
  /** Ex.: { tamanho: "P", alturaCm: 168 }. */
  modeloVeste: { tamanho: Tamanho; alturaCm: number | null } | null;
  descricao?: string;
  /** Slugs para "Complete o look" (até 3). */
  completeOLook?: readonly string[];
  /** Data de entrada (AAAA-MM-DD), usada para ordenar as novidades. */
  publicadoEm: string;
}

/** Textos exibidos quando um dado ainda não foi informado. */
export const PLACEHOLDER = {
  nome: "[NOME DA PEÇA]",
  preco: "[PREÇO]",
  medidas: "[MEDIDAS]",
  tecido: "[TECIDO]",
  modelo: "[A MODELO VESTE]",
} as const;
