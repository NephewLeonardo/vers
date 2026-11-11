/** Página provisória da etapa 1: só confirma tema, fontes e build. */
export default function Home() {
  return (
    <main
      id="conteudo"
      className="mx-auto flex min-h-dvh max-w-3xl flex-col items-center justify-center gap-8 px-6 text-center"
    >
      <p className="legenda text-cinza-texto">Etapa 1 · base do projeto</p>
      <h1 className="font-serif text-7xl italic">Vers</h1>
      <p className="font-light text-grafite">
        Moda festa, balada e praia · Curitiba e região metropolitana
      </p>
      <span className="botao">Botão de exemplo</span>
      <hr className="w-full border-linha" />
    </main>
  );
}
