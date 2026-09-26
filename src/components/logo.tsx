import Image from "next/image";
import Link from "next/link";

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link aria-label="Academia Iquiti, inicio" className={`logo ${inverse ? "logo--inverse" : ""}`} href="/">
      <Image
        alt=""
        className="logo__mark"
        height={296}
        src="/brand/iquiti/logotipo-Iquiti.svg"
        width={800}
      />
      <small>Academia</small>
    </Link>
  );
}
