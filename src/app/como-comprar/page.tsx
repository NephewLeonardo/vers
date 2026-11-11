import type { Metadata } from "next";
import Link from "next/link";
import { LinkInstagram } from "@/components/layout/LinkInstagram";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Como comprar",
  description:
    "Escolha a peça, chame a Vers no Direct do Instagram e combine pagamento e entrega em Curitiba e região metropolitana.",
  alternates: { canonical: "/como-comprar" },
};

const passos = [
  {
    titulo: "Escolha a peça",
    texto:
      "Navegue pela vitrine, abra a peça que você amou e confira as fotos, o tecido e as medidas em centímetros de cada tamanho.",
  },
  {
    titulo: "Chame no Direct",
    texto: `Escolha o tamanho e toque em “Quero esta peça”. A mensagem com o nome da peça e o tamanho é copiada e o Direct da @${site.instagram.handle} abre: é só colar e enviar.`,
  },
  {
    titulo: "Combine pagamento e entrega",
    texto:
      "Pelo Direct a gente confirma a disponibilidade e combina com você a forma de pagamento e a entrega em Curitiba e região metropolitana.",
  },
] as const;

export default function ComoComprarPage() {
  return (
    <main id="conteudo" className="mx-auto max-w-5xl px-4 pt-24 pb-24 sm:px-8 sm:pt-32">
      <header className="mx-auto max-w-xl text-center">
        <p className="legenda text-cinza-texto">Simples assim</p>
        <h1 className="mt-6 text-5xl sm:text-6xl">Como comprar</h1>
      </header>

      <ol className="mt-20 grid gap-px border border-linha bg-linha sm:grid-cols-3">
        {passos.map((passo, i) => (
          <li key={passo.titulo} className="flex flex-col gap-6 bg-branco p-8 sm:p-10">
            <span className="legenda text-cinza-texto" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="text-3xl">{passo.titulo}</h2>
            <p className="leading-relaxed text-grafite">{passo.texto}</p>
          </li>
        ))}
      </ol>

      {/* Placeholders: preencher quando a Vers definir. Não inventar. */}
      <dl className="mx-auto mt-20 grid max-w-3xl gap-10 sm:grid-cols-2">
        <div className="border-t border-linha pt-6">
          <dt className="legenda text-cinza-texto">Pagamento</dt>
          <dd className="mt-3 text-grafite">[FORMAS DE PAGAMENTO]</dd>
        </div>
        <div className="border-t border-linha pt-6">
          <dt className="legenda text-cinza-texto">Entrega</dt>
          <dd className="mt-3 text-grafite">
            Curitiba e região metropolitana · [PRAZO E CUSTO DE ENTREGA]
          </dd>
        </div>
      </dl>

      <div className="mt-20 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
        <Link href="/#pecas" className="botao">
          Ver as peças
        </Link>
        <LinkInstagram className="botao">Abrir o Instagram</LinkInstagram>
      </div>
    </main>
  );
}
