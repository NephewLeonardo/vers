/**
 * Gera as fotos PROVISÓRIAS das peças (public/pecas/placeholder/*.jpg).
 * Uso: node scripts/gerar-placeholders.mjs
 *
 * Usa o sharp que já vem com o Next. Apague as imagens geradas quando as fotos reais chegarem.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const W = 1800;
const H = 2400;
const destino = path.join(process.cwd(), "public", "pecas", "placeholder");

const fotos = [
  { arquivo: "frente.jpg", rotulo: "FRENTE", fundo: "#E4E4E8" },
  { arquivo: "costas.jpg", rotulo: "COSTAS", fundo: "#DCDCE1" },
  { arquivo: "detalhe.jpg", rotulo: "DETALHE DO TECIDO", fundo: "#D3D3D9" },
];

function svg({ rotulo, fundo }) {
  // Silhueta simples de vestido, só para dar escala; não representa nenhuma peça real.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="100%" height="100%" fill="${fundo}"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" fill="none" stroke="#8A8A92" stroke-width="3" stroke-dasharray="24 18"/>
  <path d="M780 520 L1020 520 L1060 760 L1260 1900 L540 1900 L740 760 Z" fill="none" stroke="#8A8A92" stroke-width="4"/>
  <text x="50%" y="2080" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" letter-spacing="14" fill="#1A1A1F">FOTO PROVISÓRIA</text>
  <text x="50%" y="2170" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" letter-spacing="12" fill="#6E6E76">${rotulo}</text>
</svg>`;
}

await mkdir(destino, { recursive: true });
for (const foto of fotos) {
  await sharp(Buffer.from(svg(foto)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(destino, foto.arquivo));
  console.log("ok", foto.arquivo);
}
