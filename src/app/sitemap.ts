import type { MetadataRoute } from "next";
import { getProdutos } from "@/lib/products";
import { ehPlaceholder, urlAbsoluta } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const produtos = await getProdutos();

  return [
    { url: urlAbsoluta("/"), changeFrequency: "weekly", priority: 1 },
    { url: urlAbsoluta("/como-comprar"), changeFrequency: "monthly", priority: 0.5 },
    // Só peças com dados reais entram no sitemap.
    ...produtos
      .filter((p) => !ehPlaceholder(p))
      .map((p) => ({
        url: urlAbsoluta(`/peca/${p.slug}`),
        lastModified: new Date(p.publicadoEm),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: p.fotos.slice(0, 1).map((f) => urlAbsoluta(f.src)),
      })),
  ];
}
