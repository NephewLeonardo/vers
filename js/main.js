/* ==========================================================================
   VERS — comportamento
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = window.VERS_CONFIG || {};
  var PRODUTOS = window.VERS_PRODUTOS || [];
  var CATEGORIAS = { festa: "Festa", balada: "Balada", praia: "Praia" };
  var TITULOS = {
    todas: "Todas as peças",
    novidades: "Novidades",
    festa: "Festa",
    balada: "Balada",
    praia: "Praia"
  };

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- Utilidades ---------- */
  var brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  function preco(p) { return typeof p === "number" ? brl.format(p) : "[PREÇO]"; }
  function instagramUrl() { return "https://instagram.com/" + (CONFIG.instagram || "versstore"); }
  function contatoUrl(msg) {
    var num = String(CONFIG.whatsapp || "").replace(/\D/g, "");
    if (num) return "https://wa.me/" + num + (msg ? "?text=" + encodeURIComponent(msg) : "");
    return "https://ig.me/m/" + (CONFIG.instagram || "versstore");
  }
  function temWhats() { return String(CONFIG.whatsapp || "").replace(/\D/g, "").length > 0; }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function seloDe(p) { return p.selo || (p.novo ? "Novo" : CATEGORIAS[p.categoria] || ""); }

  function midia(p, cls) {
    var box = el("span", cls);
    if (p.foto) {
      var img = document.createElement("img");
      img.src = p.foto;
      img.alt = p.fotoDescricao || p.nome;
      img.loading = "lazy";
      img.decoding = "async";
      box.appendChild(img);
    } else {
      box.classList.add("ph");
      box.appendChild(el("span", "ph-label", "Foto: " + (p.fotoDescricao || "peça").toLowerCase()));
    }
    var s = seloDe(p);
    if (s) box.appendChild(el("span", "tag", s));
    return box;
  }

  /* ---------- Links externos ---------- */
  $$("[data-instagram]").forEach(function (a) {
    a.href = instagramUrl();
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-contato]").forEach(function (a) {
    a.href = contatoUrl("Oi! Vim pelo site da Vers.");
    a.target = "_blank";
    a.rel = "noopener";
  });
  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- Catálogo ---------- */
  var grade = $("#grade");
  var contagem = $("#contagem");
  var titulo = $("#pecas-titulo");
  var filtroAtual = "todas";

  function filtrar(f) {
    if (f === "todas") return PRODUTOS;
    if (f === "novidades") return PRODUTOS.filter(function (p) { return p.novo; });
    return PRODUTOS.filter(function (p) { return p.categoria === f; });
  }

  function render() {
    var lista = filtrar(filtroAtual);
    grade.textContent = "";
    if (!lista.length) {
      grade.appendChild(el("p", "vazio", "Nenhuma peça aqui por enquanto. Novidades chegam toda semana."));
    }
    lista.forEach(function (p) {
      var card = el("button", "card");
      card.type = "button";
      card.setAttribute("data-id", p.id);
      card.appendChild(midia(p, "card-media"));
      card.appendChild(el("span", "nm", p.nome));
      var pr = el("span", "pr");
      pr.appendChild(el("span", "", preco(p.preco)));
      pr.appendChild(el("span", "", (p.tamanhos || []).join(" · ")));
      card.appendChild(pr);
      card.addEventListener("click", function () { abrirPeca(p); });
      grade.appendChild(card);
    });
    var n = lista.length;
    contagem.textContent = n + (n === 1 ? " peça" : " peças");
    titulo.textContent = TITULOS[filtroAtual] || TITULOS.todas;
    $$("#filtros button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filtro") === filtroAtual ? "true" : "false");
    });
  }

  function setFiltro(f) {
    if (!TITULOS[f]) f = "todas";
    filtroAtual = f;
    render();
  }

  $("#filtros").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) setFiltro(b.getAttribute("data-filtro"));
  });

  // Links de navegação que já escolhem o filtro (Novidades, Festa...)
  $$("a[data-filtro]").forEach(function (a) {
    a.addEventListener("click", function () { setFiltro(a.getAttribute("data-filtro")); });
  });

  render();

  /* ---------- Detalhe da peça ---------- */
  var dlg = $("#peca");
  var tamSel = null;
  var pecaAtual = null;

  function atualizarPedido() {
    var p = pecaAtual;
    var btn = $("#peca-pedir");
    var msg = "Oi! Tenho interesse na peça " + p.nome +
      (tamSel ? ", tamanho " + tamSel : "") +
      (typeof p.preco === "number" ? " (" + preco(p.preco) + ")" : "") + ".";
    btn.href = contatoUrl(msg);
    btn.textContent = temWhats() ? "Pedir pelo WhatsApp" : "Pedir pelo Instagram";
    $("#peca-nota").textContent = temWhats()
      ? "A mensagem já vai com o nome da peça e o tamanho."
      : "Você vai para o Direct da @" + (CONFIG.instagram || "versstore") + ". Mande o nome da peça e o seu tamanho.";
  }

  function abrirPeca(p) {
    pecaAtual = p;
    tamSel = (p.tamanhos && p.tamanhos.length === 1) ? p.tamanhos[0] : null;
    var media = $("#peca-media");
    media.className = "peca-media";
    media.textContent = "";
    var m = midia(p, "");
    while (m.firstChild) media.appendChild(m.firstChild);
    if (!p.foto) media.classList.add("ph");

    $("#peca-cat").textContent = CATEGORIAS[p.categoria] || "";
    $("#peca-nome").textContent = p.nome;
    $("#peca-preco").textContent = preco(p.preco);
    $("#peca-desc").textContent = p.descricao || "";

    var tams = $("#peca-tamanhos");
    tams.textContent = "";
    (p.tamanhos || []).forEach(function (t) {
      var b = el("button", "", t);
      b.type = "button";
      b.setAttribute("aria-pressed", t === tamSel ? "true" : "false");
      b.addEventListener("click", function () {
        tamSel = t;
        $$("button", tams).forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        atualizarPedido();
      });
      tams.appendChild(b);
    });

    atualizarPedido();
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    try { history.replaceState(null, "", "#peca-" + p.id); } catch (e) { /* ignora */ }
  }

  dlg.addEventListener("close", function () {
    try { history.replaceState(null, "", location.pathname + location.search); } catch (e) { /* ignora */ }
  });
  // Fecha ao clicar fora do conteúdo
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  // Abre direto por link compartilhado (#peca-<id>)
  (function () {
    var m = location.hash.match(/^#peca-(.+)$/);
    if (!m) return;
    var p = PRODUTOS.filter(function (x) { return x.id === decodeURIComponent(m[1]); })[0];
    if (p) {
      var cat = $("#pecas");
      if (cat) cat.scrollIntoView();
      abrirPeca(p);
    }
  })();

  /* ---------- Entrada 3D (V) ---------- */
  var intro = $("#topo");
  var site = $("#site");
  var cover = $("#cover");
  var vtext = $("#vtext");
  var hint = $("#hint");
  var skip = $("#skipIntro");
  var sticky = $("#stickyHeader");
  var MAX = 90;

  // Acha um ponto DENTRO do traço do V (perto da ponta de baixo),
  // para o zoom mergulhar no buraco e encher a tela.
  function acharOrigem(size, cx, cy) {
    var c = document.createElement("canvas");
    var W = Math.ceil(size * 1.4), H = Math.ceil(size * 1.4);
    c.width = W; c.height = H;
    var g = c.getContext("2d");
    if (!g) return { x: cx, y: cy };
    g.fillStyle = "#000";
    g.font = 'italic 700 ' + size + 'px VersV, "Playfair Display", serif';
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("V", W / 2, H / 2);
    var d = g.getImageData(0, 0, W, H).data;
    var top = -1, bottom = -1, x, y;
    for (y = 0; y < H; y++) {
      for (x = 0; x < W; x++) {
        if (d[(y * W + x) * 4 + 3] > 128) { if (top < 0) top = y; bottom = y; break; }
      }
    }
    if (top < 0) return { x: cx, y: cy };
    var row = Math.round(top + (bottom - top) * 0.8);
    var first = -1, last = -1;
    for (x = 0; x < W; x++) {
      if (d[(row * W + x) * 4 + 3] > 128) { if (first < 0) first = x; last = x; }
      else if (first >= 0) break;
    }
    return { x: cx + ((first + last) / 2 - W / 2), y: cy + (row - H / 2) };
  }

  function clamp(v) { return Math.max(0, Math.min(1, v)); }

  function layout() {
    if (reduce) { atualizarSticky(); return; }
    var w = window.innerWidth, h = window.innerHeight;
    var size = Math.min(h * 0.62, w * 0.75);
    vtext.setAttribute("x", w / 2);
    vtext.setAttribute("y", h / 2);
    vtext.setAttribute("font-size", size);
    var o = acharOrigem(size, w / 2, h / 2);
    cover.style.transformOrigin = o.x + "px " + o.y + "px";
    site.style.transformOrigin = o.x + "px " + o.y + "px";
    update();
  }

  function update() {
    atualizarSticky();
    if (reduce) return;
    var total = intro.offsetHeight - window.innerHeight;
    var p = clamp(window.scrollY / total);
    var zoom = Math.pow(MAX, Math.pow(p, 1.35));           // zoom exponencial: sensação de mergulho
    cover.style.transform = "scale(" + zoom + ")";
    var op = 1 - clamp((p - 0.72) / 0.2);
    cover.style.opacity = String(op);
    cover.style.visibility = op <= 0 ? "hidden" : "visible";
    // o site "vem de longe": inclinado e maior no começo, assenta no final
    var s = 1.6 - 0.6 * clamp(p / 0.9);
    var tilt = 14 * (1 - clamp(p / 0.85));
    var bright = 0.55 + 0.45 * clamp(p / 0.8);
    site.style.transform = p >= 1 ? "none" : "rotateX(" + tilt + "deg) scale(" + s + ")";
    site.style.filter = bright >= 1 ? "none" : "brightness(" + bright + ")";
    hint.style.opacity = String(1 - clamp(p / 0.06));
    var skipOp = 1 - clamp((p - 0.6) / 0.2);
    skip.style.opacity = String(skipOp);
    skip.style.visibility = skipOp <= 0 ? "hidden" : "visible";
  }

  function atualizarSticky() {
    // aparece quando o topo do site (dentro da entrada) sai da tela
    var limite = intro.offsetHeight - (reduce ? 120 : 40);
    sticky.classList.toggle("is-on", window.scrollY > limite);
  }

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { ticking = false; update(); });
    }
  }, { passive: true });
  window.addEventListener("resize", layout);

  var pronto = (document.fonts && document.fonts.load)
    ? document.fonts.load("italic 700 100px VersV")
    : Promise.resolve();
  pronto.then(layout, layout);
  layout();
})();
