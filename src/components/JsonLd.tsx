/** Dados estruturados (JSON-LD). O "<" é escapado para não fechar a tag por engano. */
export function JsonLd({ dados, nonce }: { dados: object; nonce?: string }) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(dados).replace(/</g, "\\u003c") }}
    />
  );
}
