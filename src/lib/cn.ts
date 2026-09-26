import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Une clases y resuelve conflictos de Tailwind (la última gana): `cn("inline-flex", "hidden")` → "hidden". */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
