/** Dados gerais do site. Nada aqui é segredo. */
export const site = {
  name: "Vers",
  tagline: "Moda festa, balada e praia · Curitiba e região metropolitana",
  description:
    "Vers: roupas de festa, balada e moda praia, com entrega em Curitiba e região metropolitana.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  instagram: {
    handle: "versstore",
    profileUrl: "https://www.instagram.com/versstore/",
    directUrl: "https://ig.me/m/versstore",
  },
  locale: "pt_BR",
} as const;
