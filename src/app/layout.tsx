import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { inter, playfair } from "./fonts";
import { site } from "@/lib/site";
import { Faixa } from "@/components/layout/Faixa";
import { Nav } from "@/components/nav/Nav";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Rodape } from "@/components/layout/Rodape";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Moda festa, balada e praia em Curitiba`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Ler os cabeçalhos torna a renderização dinâmica, necessária para o nonce da CSP.
  await headers();

  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#conteudo" className="pular-para-conteudo legenda">
          Pular para o conteúdo
        </a>
        <Nav faixa={<Faixa />} />
        {children}
        <Rodape />
        <SmoothScroll />
      </body>
    </html>
  );
}
