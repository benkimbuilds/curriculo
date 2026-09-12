import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowLeft } from "./icons";

export function BackLink({ children, href }: { children: ReactNode; href: string }) {
  return <Link className="back-link" href={href}><ArrowLeft /> <span>{children}</span></Link>;
}
