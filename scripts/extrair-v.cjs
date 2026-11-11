// Script de manutenção (não roda no build). Precisa do opentype.js só na hora de rodar:
//   npm i --no-save opentype.js@1.3.4
//   node scripts/extrair-v.cjs <PlayfairDisplay-Italic[wght].ttf> src/components/entrada/v-path.ts
// A fonte está em github.com/google/fonts (ofl/playfairdisplay).
const opentype = require("opentype.js");
const fs = require("fs");

const [, , fontePath, saida] = process.argv;
const font = opentype.loadSync(fontePath);
const glyph = font.charToGlyph("V");
const cmds = glyph.getPath(0, 0, 1000).commands; // tamanho 1000, y para baixo

// Bounding box
const xs = [],
  ys = [];
for (const c of cmds)
  for (const k of ["x", "y", "x1", "y1", "x2", "y2"])
    if (c[k] !== undefined) (k.startsWith("x") ? xs : ys).push(c[k]);
const minX = Math.min(...xs),
  minY = Math.min(...ys),
  maxX = Math.max(...xs),
  maxY = Math.max(...ys);
const W = maxX - minX,
  H = maxY - minY;
const r2 = (n) => Math.round(n * 100) / 100;
const tx = (x) => r2(x - minX),
  ty = (y) => r2(y - minY);

// Path SVG normalizado (origem no canto da caixa)
let d = "";
for (const c of cmds) {
  if (c.type === "M") d += `M${tx(c.x)} ${ty(c.y)}`;
  else if (c.type === "L") d += `L${tx(c.x)} ${ty(c.y)}`;
  else if (c.type === "Q") d += `Q${tx(c.x1)} ${ty(c.y1)} ${tx(c.x)} ${ty(c.y)}`;
  else if (c.type === "C")
    d += `C${tx(c.x1)} ${ty(c.y1)} ${tx(c.x2)} ${ty(c.y2)} ${tx(c.x)} ${ty(c.y)}`;
  else if (c.type === "Z") d += "Z";
}

// Polígonos achatados para o cálculo
const polys = [];
let cur = null,
  px = 0,
  py = 0;
for (const c of cmds) {
  if (c.type === "M") {
    cur = [[c.x - minX, c.y - minY]];
    polys.push(cur);
    px = c.x;
    py = c.y;
  } else if (c.type === "L") {
    cur.push([c.x - minX, c.y - minY]);
    px = c.x;
    py = c.y;
  } else if (c.type === "Q") {
    for (let t = 0.1; t <= 1.0001; t += 0.1) {
      const a = (1 - t) ** 2,
        b = 2 * (1 - t) * t,
        e = t * t;
      cur.push([a * px + b * c.x1 + e * c.x - minX, a * py + b * c.y1 + e * c.y - minY]);
    }
    px = c.x;
    py = c.y;
  } else if (c.type === "C") {
    for (let t = 0.1; t <= 1.0001; t += 0.1) {
      const a = (1 - t) ** 3,
        b = 3 * (1 - t) ** 2 * t,
        e = 3 * (1 - t) * t * t,
        f = t ** 3;
      cur.push([
        a * px + b * c.x1 + e * c.x2 + f * c.x - minX,
        a * py + b * c.y1 + e * c.y2 + f * c.y - minY,
      ]);
    }
    px = c.x;
    py = c.y;
  }
}

function dentro(x, y) {
  // even-odd
  let inn = false;
  for (const p of polys)
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [xi, yi] = p[i],
        [xj, yj] = p[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inn = !inn;
    }
  return inn;
}
function distBorda(x, y) {
  let m = Infinity;
  for (const p of polys)
    for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
      const [x1, y1] = p[j],
        [x2, y2] = p[i];
      const dx = x2 - x1,
        dy = y2 - y1,
        L = dx * dx + dy * dy;
      let t = L ? ((x - x1) * dx + (y - y1) * dy) / L : 0;
      t = Math.max(0, Math.min(1, t));
      m = Math.min(m, Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy)));
    }
  return m;
}

// Busca em grade + refinamento
let best = { x: 0, y: 0, r: -1 };
for (let y = Math.round(H * 0.4); y <= Math.round(H * 0.5); y += 1)
  for (let x = 0; x <= W; x += 1)
    if (dentro(x, y)) {
      const r = distBorda(x, y);
      if (r > best.r) best = { x, y, r };
    }
for (let passo = 1; passo > 0.05; passo /= 2) {
  let melhorou = true;
  while (melhorou) {
    melhorou = false;
    for (const [dx, dy] of [
      [passo, 0],
      [-passo, 0],
      [0, passo],
      [0, -passo],
    ]) {
      const x = best.x + dx,
        y = best.y + dy;
      if (y >= H * 0.4 && y <= H * 0.5 && dentro(x, y)) {
        const r = distBorda(x, y);
        if (r > best.r) {
          best = { x, y, r };
          melhorou = true;
        }
      }
    }
  }
}

const out = `/**
 * Contorno do "V" da Playfair Display Italic (peso 400), licença SIL Open Font License 1.1.
 * GERADO automaticamente: coordenadas normalizadas (origem no canto superior esquerdo da caixa,
 * glifo renderizado a 1000 unidades). Não edite à mão.
 *
 * PONTO_ZOOM é o centro do maior círculo que cabe no traço grosso do V, entre 40% e 50%
 * da altura (meio da haste, RAIO_ZOOM).
 * Ampliar em torno dele garante que o recorte enche a tela sem sobrar faixas pretas:
 * basta que RAIO_ZOOM × escala ≥ metade da diagonal da tela.
 */
export const V_PATH = "${d}";
export const V_LARGURA = ${r2(W)};
export const V_ALTURA = ${r2(H)};
export const PONTO_ZOOM = { x: ${r2(best.x)}, y: ${r2(best.y)} } as const;
export const RAIO_ZOOM = ${r2(best.r)};
`;
fs.writeFileSync(saida, out);
console.log({ W: r2(W), H: r2(H), ponto: best, comandos: cmds.length, contornos: polys.length });
