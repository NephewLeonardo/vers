import { produtos } from "@/content/products";
import type { Categoria, Produto } from "@/content/types";

/*
 * Única porta de acesso às peças. Hoje lê o arquivo local; para usar um CMS,
 * troque o corpo destas funções por chamadas à API e mantenha as assinaturas.
 */

export async function getProdutos(filtro?: { categoria?: Categoria }): Promise<Produto[]> {
  const lista = [...produtos].sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
  return filtro?.categoria ? lista.filter((p) => p.categorias.includes(filtro.categoria!)) : lista;
}

export async function getProduto(slug: string): Promise<Produto | null> {
  return produtos.find((p) => p.slug === slug) ?? null;
}

export async function getSlugs(): Promise<string[]> {
  return produtos.map((p) => p.slug);
}

/** Até 3 peças para "Complete o look": as escolhidas à mão, completadas por peças da mesma categoria. */
export async function getCompleteOLook(produto: Produto, limite = 3): Promise<Produto[]> {
  const escolhidas = (produto.completeOLook ?? [])
    .map((slug) => produtos.find((p) => p.slug === slug))
    .filter((p): p is Produto => p !== undefined);

  const extras = produtos.filter(
    (p) =>
      p.slug !== produto.slug &&
      !escolhidas.includes(p) &&
      p.categorias.some((c) => produto.categorias.includes(c)),
  );
  const resto = produtos.filter(
    (p) => p.slug !== produto.slug && !escolhidas.includes(p) && !extras.includes(p),
  );

  return [...escolhidas, ...extras, ...resto].slice(0, limite);
}
