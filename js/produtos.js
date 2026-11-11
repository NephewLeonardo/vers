/* ==========================================================================
   VERS — dados da loja
   Edite este arquivo para trocar contatos e cadastrar as peças.
   ========================================================================== */

window.VERS_CONFIG = {
  // WhatsApp com DDI + DDD + número, só dígitos. Ex.: "5541999999999".
  // Enquanto estiver vazio, o botão de pedido leva para o Direct do Instagram.
  whatsapp: "",
  instagram: "versstore",
  regiaoEntrega: "Curitiba e região metropolitana"
};

/*
  Cada peça:
    id            identificador único, sem espaços (usado no link da peça)
    nome          nome que aparece no card
    preco         número em reais (ex.: 189.9) ou null enquanto não tiver
    categoria     "festa" | "balada" | "praia"
    novo          true para aparecer em "Novidades" e ganhar o selo "Novo"
    selo          texto opcional do selo (ex.: "Réveillon"); se vazio, usa a categoria
    tamanhos      lista de tamanhos disponíveis
    foto          caminho da foto, ex.: "assets/img/pecas/vestido-branco.jpg" (3:4, retrato)
    fotoDescricao texto alternativo da foto (e legenda enquanto não tiver foto)
    descricao     texto curto que aparece ao abrir a peça
*/
window.VERS_PRODUTOS = [
  { id: "peca-01", nome: "[NOME DA PEÇA]", preco: null, categoria: "festa",  novo: true,  selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Vestido de festa",       descricao: "" },
  { id: "peca-02", nome: "[NOME DA PEÇA]", preco: null, categoria: "festa",  novo: false, selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Conjunto de formatura",  descricao: "" },
  { id: "peca-03", nome: "[NOME DA PEÇA]", preco: null, categoria: "balada", novo: false, selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Top e saia",             descricao: "" },
  { id: "peca-04", nome: "[NOME DA PEÇA]", preco: null, categoria: "praia",  novo: true,  selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Biquíni",                descricao: "" },
  { id: "peca-05", nome: "[NOME DA PEÇA]", preco: null, categoria: "festa",  novo: true,  selo: "Réveillon", tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Vestido branco",         descricao: "" },
  { id: "peca-06", nome: "[NOME DA PEÇA]", preco: null, categoria: "balada", novo: false, selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Body com brilho",        descricao: "" },
  { id: "peca-07", nome: "[NOME DA PEÇA]", preco: null, categoria: "festa",  novo: false, selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Vestido longo",          descricao: "" },
  { id: "peca-08", nome: "[NOME DA PEÇA]", preco: null, categoria: "praia",  novo: false, selo: "",          tamanhos: ["P", "M", "G"], foto: "", fotoDescricao: "Saída de praia",         descricao: "" }
];
