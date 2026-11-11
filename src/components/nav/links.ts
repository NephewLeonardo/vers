/** Links da navegação principal. As categorias abrem a vitrine já filtrada. */
export const LINKS_ESQUERDA = [
  { href: "/#pecas", label: "Novidades" },
  { href: "/?categoria=festa#pecas", label: "Festa" },
  { href: "/?categoria=balada#pecas", label: "Balada" },
  { href: "/?categoria=praia#pecas", label: "Praia" },
] as const;

export const LINKS_DIREITA = [{ href: "/como-comprar", label: "Como comprar" }] as const;
