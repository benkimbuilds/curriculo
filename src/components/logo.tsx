import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link aria-label="Ruta, inicio" className={`logo ${inverse ? "logo--inverse" : ""}`} href="/">
      <span>Ruta</span><small>Currículo abierto</small>
    </Link>
  );
}
