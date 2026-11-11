import type { Produto } from "@/content/types";
import { ProductCard } from "./ProductCard";

export function CompleteOLook({ produtos }: { produtos: Produto[] }) {
  if (produtos.length === 0) return null;

  return (
    <section aria-labelledby="titulo-look" className="border-t border-linha pt-16 sm:pt-24">
      <h2 id="titulo-look" className="text-4xl sm:text-5xl">
        Complete o look
      </h2>
      {/* Celular: carrossel com snap. Desktop: 3 colunas. */}
      <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 lg:gap-8">
        {produtos.map((p) => (
          <li key={p.slug} className="w-[70%] shrink-0 snap-start sm:w-auto">
            <ProductCard produto={p} titulo="h3" sizes="(min-width: 640px) 33vw, 70vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
