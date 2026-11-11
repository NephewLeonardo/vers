import Image from "next/image";
import Link from "next/link";
import type { Produto } from "@/content/types";
import { formatarPreco, nomeEtiqueta } from "@/lib/format";

interface ProductCardProps {
  produto: Produto;
  /** Atributo `sizes` da foto; muda conforme a grade em que o cartão aparece. */
  sizes?: string;
  /** Use em nível de título correto para a página (h2 na vitrine, h3 em blocos internos). */
  titulo?: "h2" | "h3";
}

export function ProductCard({
  produto,
  sizes = "(min-width: 1024px) 33vw, 50vw",
  titulo: Titulo = "h2",
}: ProductCardProps) {
  const capa = produto.fotos[0];
  const etiqueta = produto.etiquetas[0];
  const esgotados = new Set(produto.esgotados ?? []);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-linha">
        {capa && (
          <Image
            src={capa.src}
            alt={capa.alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-700 ease-vers group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
        {etiqueta && (
          <span className="legenda absolute top-3 left-3 rounded-pilula bg-branco/90 px-3 py-1 text-preto">
            {nomeEtiqueta(etiqueta)}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        <Titulo className="font-sans text-base font-normal not-italic">
          {/* O link cobre o cartão inteiro, mas só o nome é lido como texto do link. */}
          <Link
            href={`/peca/${produto.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:outline-offset-4 focus-visible:after:outline-preto"
          >
            {produto.nome}
          </Link>
        </Titulo>
        <p className="text-sm text-grafite">{formatarPreco(produto.precoCentavos)}</p>
        <p className="legenda text-cinza-texto">
          <span className="sr-only">Tamanhos: </span>
          {produto.tamanhos.map((t, i) => (
            <span key={t} className={esgotados.has(t) ? "line-through" : undefined}>
              {i > 0 && " · "}
              {t}
              {esgotados.has(t) && <span className="sr-only"> (esgotado)</span>}
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}
