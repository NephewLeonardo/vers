import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="conteudo"
      className="mx-auto flex min-h-[70dvh] max-w-xl flex-col items-center justify-center gap-8 px-4 text-center"
    >
      <p className="legenda text-cinza-texto">Erro 404</p>
      <h1 className="text-5xl">Esta página não existe</h1>
      <p className="text-grafite">A peça pode ter saído da vitrine ou o link está incompleto.</p>
      <Link href="/#pecas" className="botao">
        Ver todas as peças
      </Link>
    </main>
  );
}
