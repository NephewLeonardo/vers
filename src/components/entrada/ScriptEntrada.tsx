/**
 * Roda antes da primeira pintura (inline, com o nonce da CSP) para decidir:
 * - com #âncora na URL (ex.: /?categoria=festa#pecas): pula a entrada;
 * - já vista nesta sessão: versão curta.
 * Assim a página não pisca a versão errada antes do JavaScript carregar.
 */
export const CHAVE_SESSAO = "vers-entrada-vista";

const CODIGO = `try{var h=document.documentElement;if(location.hash){h.setAttribute("data-entrada-pular","")}else if(sessionStorage.getItem("${CHAVE_SESSAO}")){h.setAttribute("data-entrada-curta","")}}catch(e){}`;

export function ScriptEntrada({ nonce }: { nonce: string | undefined }) {
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: CODIGO }} />;
}
