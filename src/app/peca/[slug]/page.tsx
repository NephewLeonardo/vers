import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLACEHOLDER } from "@/content/types";
import { CompleteOLook } from "@/components/shop/CompleteOLook";
import { Galeria } from "@/components/shop/Galeria";
import { PainelCompra } from "@/components/shop/PainelCompra";
import { formatarPreco, nomeEtiqueta } from "@/lib/format";
import { getCompleteOLook, getProduto } from "@/lib/products";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const produto = await getProduto(slug);
  if (!produto) return { title: "Peça não encontrada" };

  const descricao =
    produto.descricao ??
    `${produto.nome} · ${formatarPreco(produto.precoCentavos)} · Tamanhos ${produto.tamanhos.join(", ")}. Peça pelo Direct da @${site.instagram.handle}.`;
  const capa = produto.fotos[0];

  return {
    title: produto.nome,
    description: descricao,
    alternates: { canonical: `/peca/${produto.slug}` },
    openGraph: {
      title: produto.nome,
      description: descricao,
      url: `/peca/${produto.slug}`,
      images: capa
        ? [{ url: capa.src, width: capa.width, height: capa.height, alt: capa.alt }]
        : [],
    },
  };
}

export default async function PecaPage({ params }: PageProps) {
  const { slug } = await params;
  const produto = await getProduto(slug);
  if (!produto) notFound();

  const relacionadas = await getCompleteOLook(produto);
  const urlPeca = new URL(`/peca/${produto.slug}`, site.url).toString();
  const etiqueta = produto.etiquetas[0];

  return (
    <main id="conteudo" className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-8 sm:pt-36">
      <nav aria-label="Você está em" className="legenda mb-6 text-cinza-texto">
        <ol className="flex gap-2">
          <li>
            <Link href="/#pecas" className="hover:text-preto">
              Vitrine
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-grafite">
            {produto.nome}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Galeria fotos={produto.fotos} nomePeca={produto.nome} />
        </div>

        <div className="lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <header className="flex flex-col gap-4">
              {etiqueta && <p className="legenda text-cinza-texto">{nomeEtiqueta(etiqueta)}</p>}
              <h1 className="text-4xl leading-tight sm:text-5xl">{produto.nome}</h1>
              <p className="text-lg text-grafite">{formatarPreco(produto.precoCentavos)}</p>
            </header>

            <PainelCompra produto={produto} urlPeca={urlPeca} />

            <dl className="grid gap-6 border-t border-linha pt-8">
              <div>
                <dt className="legenda text-cinza-texto">Tecido</dt>
                <dd className="mt-2 text-grafite">{produto.tecido ?? PLACEHOLDER.tecido}</dd>
              </div>
              <div>
                <dt className="legenda text-cinza-texto">A modelo veste</dt>
                <dd className="mt-2 text-grafite">
                  {produto.modeloVeste
                    ? `Tamanho ${produto.modeloVeste.tamanho}${
                        produto.modeloVeste.alturaCm
                          ? ` · altura ${produto.modeloVeste.alturaCm} cm`
                          : ""
                      }`
                    : PLACEHOLDER.modelo}
                </dd>
              </div>
              {produto.descricao && (
                <div>
                  <dt className="legenda text-cinza-texto">Sobre a peça</dt>
                  <dd className="mt-2 leading-relaxed text-grafite">{produto.descricao}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-24 sm:mt-32">
        <CompleteOLook produtos={relacionadas} />
      </div>
    </main>
  );
}
