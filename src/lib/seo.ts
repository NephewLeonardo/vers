import type { Produto } from "@/content/types";
import { site } from "./site";

/** Peça ainda com dados provisórios ([NOME DA PEÇA] etc.): fica fora do Google e do sitemap. */
export function ehPlaceholder(produto: Pick<Produto, "nome">): boolean {
  return produto.nome.includes("[");
}

export function urlAbsoluta(caminho: string): string {
  return new URL(caminho, site.url).toString();
}

/** schema.org/Product para a página da peça. */
export function jsonLdProduto(produto: Produto) {
  const url = urlAbsoluta(`/peca/${produto.slug}`);
  const esgotados = new Set(produto.esgotados ?? []);
  const disponivel = produto.tamanhos.some((t) => !esgotados.has(t));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    url,
    sku: produto.slug,
    image: produto.fotos.map((f) => urlAbsoluta(f.src)),
    description:
      produto.descricao ??
      `${produto.nome}. Tamanhos ${produto.tamanhos.join(", ")}. Pedido pelo Direct.`,
    brand: { "@type": "Brand", name: site.name },
    category: produto.categorias.join(", "),
    size: produto.tamanhos,
    ...(produto.tecido ? { material: produto.tecido } : {}),
    // Sem preço definido não há oferta (evita dados falsos para o Google).
    ...(produto.precoCentavos !== null
      ? {
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "BRL",
            price: (produto.precoCentavos / 100).toFixed(2),
            availability: disponivel
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: site.name },
            areaServed: "Curitiba e região metropolitana",
          },
        }
      : {}),
  };
}

/** schema.org/Organization para a página inicial. */
export function jsonLdOrganizacao() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: urlAbsoluta("/apple-icon.png"),
    description: site.description,
    sameAs: [site.instagram.profileUrl],
    areaServed: "Curitiba e região metropolitana",
  };
}
