/**
 * Gera as imagens PROVISÓRIAS: fotos das peças (public/pecas/placeholder/) e da campanha
 * da entrada (public/campanha/).
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

// ---------- Campanha da entrada ----------
const campanha = path.join(process.cwd(), "public", "campanha");
await mkdir(campanha, { recursive: true });

const rotulo = (x, y, l1, l2, cor = "#FFFFFF", cor2 = "#8A8A92") =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, sans-serif" font-size="44" letter-spacing="12" fill="${cor}">${l1}</text>
   <text x="${x}" y="${y + 64}" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" letter-spacing="10" fill="${cor2}">${l2}</text>`;

// Fundo (camada 1): paisagem escura, tipo cenário noturno.
const fundo = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1600">
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#3A3A42"/><stop offset="0.55" stop-color="#1A1A1F"/><stop offset="1" stop-color="#050506"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${Array.from({ length: 9 }, (_, i) => `<circle cx="${260 + i * 240}" cy="${300 + (i % 3) * 90}" r="${40 + (i % 4) * 18}" fill="#8A8A92" opacity="${0.06 + (i % 3) * 0.03}"/>`).join("")}
  <rect x="40" y="40" width="2320" height="1520" fill="none" stroke="#8A8A92" stroke-width="3" stroke-dasharray="24 18"/>
  ${rotulo(1200, 1420, "CAMADA 1 · FOTO DE FUNDO DA CAMPANHA", "PROVISÓRIA · 2400 × 1600")}
</svg>`;
await sharp(Buffer.from(fundo))
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(campanha, "fundo.jpg"));

// Modelo recortada (camada 2): PNG com transparência.
const modelo = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800">
  <g fill="#E4E4E8" fill-opacity="0.9" stroke="#FFFFFF" stroke-width="3">
    <ellipse cx="600" cy="260" rx="95" ry="120"/>
    <path d="M560 370 L640 370 L650 440 L790 520 L760 900 L880 1640 L320 1640 L440 900 L410 520 L550 440 Z"/>
  </g>
  <rect x="300" y="1660" width="600" height="120" rx="60" fill="#000000" fill-opacity="0.6"/>
  ${rotulo(600, 1712, "CAMADA 2 · MODELO RECORTADA", "PNG PROVISÓRIO")}
</svg>`;
await sharp(Buffer.from(modelo))
  .png({ compressionLevel: 9 })
  .toFile(path.join(campanha, "modelo.png"));

// Celular: fundo + modelo numa imagem só (menos camadas).
const mobile = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="2133">
  <defs>
    <radialGradient id="g" cx="50%" cy="35%" r="80%">
      <stop offset="0" stop-color="#3A3A42"/><stop offset="0.55" stop-color="#1A1A1F"/><stop offset="1" stop-color="#050506"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g fill="#E4E4E8" fill-opacity="0.85" transform="translate(150 380) scale(0.75)">
    <ellipse cx="600" cy="260" rx="95" ry="120"/>
    <path d="M560 370 L640 370 L650 440 L790 520 L760 900 L880 1640 L320 1640 L440 900 L410 520 L550 440 Z"/>
  </g>
  <rect x="40" y="40" width="1120" height="2053" fill="none" stroke="#8A8A92" stroke-width="3" stroke-dasharray="24 18"/>
  ${rotulo(600, 1900, "CELULAR · FUNDO + MODELO", "PROVISÓRIA · 1200 × 2133")}
</svg>`;
await sharp(Buffer.from(mobile))
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(path.join(campanha, "celular.jpg"));
console.log("ok campanha");
