import { site } from "@/lib/site";

interface LinkInstagramProps {
  className?: string;
  children?: React.ReactNode;
}

/** Link para o perfil @versstore. Abre em nova aba. */
export function LinkInstagram({ className = "", children }: LinkInstagramProps) {
  return (
    <a
      href={site.instagram.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children ?? `@${site.instagram.handle}`}
      <span className="sr-only"> (abre o Instagram em nova aba)</span>
    </a>
  );
}
