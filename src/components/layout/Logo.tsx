import Link from "next/link";

interface LogoProps {
  className?: string;
  /** Quando informado, o logo vira um link. */
  href?: string;
}

/** "Vers" em Playfair Display itálico. */
export function Logo({ className = "", href }: LogoProps) {
  const classes = `font-serif font-normal italic leading-none tracking-tight ${className}`;
  if (!href) return <span className={classes}>Vers</span>;
  return (
    <Link href={href} className={classes} aria-label="Vers, página inicial">
      Vers
    </Link>
  );
}
