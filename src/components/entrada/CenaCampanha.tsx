import Image, { getImageProps } from "next/image";

/**
 * Cena de campanha vista "dentro" do V.
 * Desktop: 3 camadas (fundo, frase, modelo recortada à frente da frase).
 * Celular: 2 camadas (foto única com fundo + modelo, e a frase), mais leve.
 *
 * Imagens PROVISÓRIAS em public/campanha/. Troque pelos arquivos reais com o mesmo nome
 * (ou ajuste os caminhos e tamanhos abaixo).
 */
const ALT_CAMPANHA = "Campanha Vers: [DESCRIÇÃO DA FOTO DA CAMPANHA]";

export function CenaCampanha() {
  const {
    props: { srcSet: srcSetDesktop },
  } = getImageProps({
    src: "/campanha/fundo.jpg",
    alt: "",
    width: 2400,
    height: 1600,
    sizes: "100vw",
  });
  const {
    props: { srcSet: srcSetCelular, ...imgCelular },
  } = getImageProps({
    src: "/campanha/celular.jpg",
    alt: ALT_CAMPANHA,
    width: 1200,
    height: 2133,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    <div data-cena className="absolute inset-0 overflow-hidden bg-grafite">
      <picture data-camada="fundo" className="absolute inset-0 block will-change-transform">
        <source media="(min-width: 768px)" srcSet={srcSetDesktop} sizes="100vw" />
        <img
          {...imgCelular}
          alt={ALT_CAMPANHA}
          srcSet={srcSetCelular}
          className="h-full w-full object-cover"
        />
      </picture>

      <p
        data-camada="frase"
        className="absolute inset-x-0 top-[16%] px-6 text-center font-serif text-[2.6rem] leading-[1.05] font-normal text-branco italic will-change-transform sm:text-7xl lg:text-8xl"
      >
        A noite começa no look
      </p>

      <div
        data-camada="modelo"
        className="absolute inset-x-0 bottom-0 hidden h-[88%] will-change-transform md:block"
      >
        <Image
          src="/campanha/modelo.png"
          alt=""
          fill
          sizes="50vw"
          loading="eager"
          className="object-contain object-bottom"
        />
      </div>

      {/* Véu branco: a cena clareia enquanto a vitrine sobe (sem salto de brilho). */}
      <div data-veu className="absolute inset-0 bg-branco opacity-0" />
    </div>
  );
}
