# Vers

Site da Vers: moda festa, balada e praia, com entrega em Curitiba e região metropolitana.

Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 4 + GSAP/ScrollTrigger + Lenis.
Hospedagem pensada para a Vercel.

## Comandos

| Comando             | O que faz                           |
| ------------------- | ----------------------------------- |
| `npm run dev`       | servidor de desenvolvimento (:3000) |
| `npm run build`     | build de produção                   |
| `npm start`         | sobe o build de produção            |
| `npm run lint`      | ESLint                              |
| `npm run typecheck` | checagem de tipos                   |
| `npm run format`    | formata com Prettier                |

## Cadastrar uma peça

1. Coloque as fotos em `public/pecas/<slug>/` (`frente.jpg`, `costas.jpg`, `detalhe.jpg`), em retrato 3:4,
   de preferência com 1800 × 2400 px para o zoom ficar nítido.
2. Em `src/content/products.ts`, adicione um item com `slug`, `nome`, `precoCentavos` (ex.: `18990` = R$ 189,90),
   `categorias`, `etiquetas`, `tamanhos`, `esgotados`, `medidas` (cm), `tecido`, `modeloVeste`, `publicadoEm`
   e um texto alternativo (`alt`) descrevendo cada foto.
3. Apague as peças de exemplo (`peca-exemplo-*`) quando as reais estiverem prontas.

Peças com nome entre colchetes (ex.: `[NOME DA PEÇA]`) ficam fora do Google (`noindex`) e do sitemap.
Sem preço, a página mostra `[PREÇO]` e os dados estruturados não declaram oferta.

Para trocar por um CMS no futuro, reescreva só `src/lib/products.ts` mantendo as mesmas funções.

## Fotos da campanha (entrada)

Substitua os arquivos provisórios em `public/campanha/` mantendo os nomes:

| Arquivo       | Uso                                              | Tamanho sugerido |
| ------------- | ------------------------------------------------ | ---------------- |
| `fundo.jpg`   | camada de fundo (desktop)                        | 2400 × 1600      |
| `modelo.png`  | modelo recortada, **PNG com fundo transparente** | 1200 × 1800      |
| `celular.jpg` | versão do celular: fundo + modelo numa imagem só | 1200 × 2133      |

Depois, troque o texto alternativo `[DESCRIÇÃO DA FOTO DA CAMPANHA]` em
`src/components/entrada/CenaCampanha.tsx`.

## Onde fica cada coisa

- `src/styles/theme.css`: **tokens da marca** (cores, fontes, legendas, pílulas)
- `src/components/entrada/`: entrada 3D (V, zoom, cena de campanha)
- `src/components/nav/`: barra de navegação e menu do celular
- `src/components/shop/`: vitrine, cartão, galeria com zoom, painel de compra (Direct)
- `src/lib/site.ts`: nome, descrição e Instagram
- `src/lib/seo.ts`: dados estruturados (schema.org)
- `src/proxy.ts`: Content-Security-Policy com nonce por requisição
- `next.config.ts`: demais cabeçalhos de segurança
- `scripts/`: geradores das imagens provisórias e do contorno do V (manutenção, não rodam no build)

## Pedidos pelo Direct

O Instagram não aceita mensagem pré-preenchida por link. O botão "Quero esta peça" copia
`Oi, Vers! Quero a peça "…" no tamanho M. [link da peça]` e abre `ig.me/m/versstore`; a cliente só cola
e envia.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` (não vai para o git). Na Vercel, sem `NEXT_PUBLIC_SITE_URL`,
o endereço do site é o domínio de produção do projeto; com domínio próprio, defina essa variável.
