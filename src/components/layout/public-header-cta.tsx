"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import type { navItems } from "@/lib/nav";
import { MobileMenu } from "./mobile-menu";
import { platformCta } from "./platform-cta";

export function PublicHeaderCta({
  brandName,
  items,
  initialHref = platformCta.href,
  initialLabel = platformCta.shortLabel,
}: {
  brandName: string;
  items: typeof navItems;
  initialHref?: string;
  initialLabel?: string;
}) {
  const [cta, setCta] = useState({ href: initialHref, label: initialLabel });

  useEffect(() => {
    if (initialHref !== platformCta.href) return;
    let cancelled = false;
    fetch("/api/account-cta", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { accountHref?: string; accountLabel?: string } | null) => {
        if (!cancelled && data?.accountHref && data?.accountLabel) {
          setCta({ href: data.accountHref, label: data.accountLabel });
        }
      })
      .catch(() => {
        // Fallback silencioso al CTA por defecto.
      });
    return () => {
      cancelled = true;
    };
  }, [initialHref]);

  return (
    <div className="flex items-center justify-end gap-2">
      <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
        {cta.label}
      </ButtonLink>
      <MobileMenu
        brandName={brandName}
        cta={{ ...platformCta, href: cta.href, shortLabel: cta.label }}
        items={items}
      />
    </div>
  );
}
