import Link from "next/link";
import { site } from "@/lib/site";
import { LinkInstagram } from "./LinkInstagram";
import { Logo } from "./Logo";

const links = [
  { href: "/#pecas", label: "Todas as peças" },
  { href: "/como-comprar", label: "Como comprar" },
] as const;

export function Rodape() {
  return (
    <footer className="border-t border-linha">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 py-16 text-center sm:px-8">
        <Logo href="/" className="text-4xl" />
        <p className="max-w-xs text-sm text-grafite">{site.tagline}</p>

        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="legenda text-grafite hover:text-preto">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <LinkInstagram className="legenda text-grafite hover:text-preto" />
            </li>
          </ul>
        </nav>

        <p className="legenda text-cinza-texto">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
