# Vers

Site da Vers: moda festa, balada e praia, com entrega em Curitiba e região metropolitana.

Next.js (App Router) + TypeScript strict + Tailwind CSS v4. Hospedagem pensada para a Vercel.

## Comandos

| Comando             | O que faz                           |
| ------------------- | ----------------------------------- |
| `npm run dev`       | servidor de desenvolvimento (:3000) |
| `npm run build`     | build de produção                   |
| `npm start`         | sobe o build de produção            |
| `npm run lint`      | ESLint                              |
| `npm run typecheck` | checagem de tipos                   |
| `npm run format`    | formata com Prettier                |

## Onde fica cada coisa

- `src/styles/theme.css`: **tokens da marca** (cores, fontes, legendas, pílulas)
- `src/app/fonts.ts`: Playfair Display itálico 400 e Inter 300/400 (servidas pelo próprio site)
- `src/proxy.ts`: Content-Security-Policy com nonce por requisição
- `next.config.ts`: demais cabeçalhos de segurança
- `src/lib/site.ts`: nome, descrição e Instagram
- `src/assets/fonts/versv.woff2`: glifo do V da entrada

## Variáveis de ambiente

Copie `.env.example` para `.env.local`. Arquivos `.env*.local` não vão para o git.
