import { Inter, Playfair_Display } from "next/font/google";

/**
 * O next/font baixa as fontes no build e as serve do próprio domínio:
 * nenhuma requisição ao Google em tempo de execução.
 */
export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400"],
  display: "swap",
  variable: "--font-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-inter",
});
