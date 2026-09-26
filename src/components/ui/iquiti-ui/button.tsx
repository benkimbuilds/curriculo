import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

/**
 * primary y secondary usan `btn-wipe` (globals.css): en hover/foco un relleno nace en el centro y
 * el texto cambia de color. Cada variante define qué color entra (--btn-wipe-bg) y el del texto (--btn-wipe-fg).
 */
const variants: Record<Variant, string> = {
  primary:
    "btn-wipe border border-transparent bg-action text-action-fg [--btn-wipe-bg:var(--iq-action-hover)] [--btn-wipe-fg:var(--iq-action-hover-fg)]",
  secondary:
    "btn-wipe border border-line-strong text-fg hover:border-fg focus-visible:border-fg [--btn-wipe-bg:var(--iq-fg)] [--btn-wipe-fg:var(--iq-bg)]",
  ghost: "px-0 text-fg underline-offset-[6px] hover:underline decoration-1",
};

const sizes: Record<Size, string> = {
  md: "min-h-target px-7 gap-3",
  sm: "min-h-10 px-5 gap-2",
};

export const buttonClasses = (variant: Variant = "primary", size: Size = "md") =>
  cn(
    "group/button inline-flex items-center justify-center rounded-full type-label whitespace-nowrap active:translate-y-px",
    "transition-[color,border-color,translate] duration-(--iq-duration-slow) ease-out-expo",
    "disabled:pointer-events-none aria-disabled:pointer-events-none aria-disabled:opacity-60",
    sizes[size],
    variants[variant],
    variant === "ghost" && "px-0",
  );

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "children"> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
};

/**
 * Enlace con apariencia de botón. Un enlace navega; un <button> ejecuta una acción.
 * Nunca usar ButtonLink para acciones ni <button> para navegar.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonClasses(variant, size), className)} {...props}>
      {children}
    </Link>
  );
}
