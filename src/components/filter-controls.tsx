"use client";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  type FormEvent,
  type FormHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export function FilterBar({
  autoSubmit = true,
  children,
  className = "",
  debounceMs = 300,
  onSubmit,
  resetPageParam = "pagina",
  ...props
}: FormHTMLAttributes<HTMLFormElement> & {
  autoSubmit?: boolean;
  debounceMs?: number;
  resetPageParam?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function navigateWithForm(form: HTMLFormElement) {
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [key, rawValue] of data.entries()) {
      if (key === resetPageParam) continue;
      const value = typeof rawValue === "string" ? rawValue.trim() : "";
      if (value) params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function handleSubmit(event: Parameters<NonNullable<FormHTMLAttributes<HTMLFormElement>["onSubmit"]>>[0]) {
    onSubmit?.(event);
    if (event.defaultPrevented || !autoSubmit) return;
    event.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    navigateWithForm(event.currentTarget);
  }

  function handleChange(event: FormEvent<HTMLFormElement>) {
    if (!autoSubmit) return;
    const target = event.target as HTMLElement | null;
    const form = formRef.current;
    if (!form || !target) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (target.tagName === "SELECT" || (target as HTMLInputElement).type === "checkbox") {
      navigateWithForm(form);
      return;
    }

    timerRef.current = setTimeout(() => {
      navigateWithForm(form);
    }, debounceMs);
  }

  return (
    <form
      className={`filter-controls ${className}`.trim()}
      method="get"
      onChange={handleChange}
      onSubmit={handleSubmit}
      ref={formRef}
      {...props}
    >
      {children}
    </form>
  );
}

export function FilterSearchInput({
  className = "",
  label = "Buscar",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <label className={`filter-controls__search ${className}`.trim()}>
      <span className="sr-only">{label}</span>
      <Search aria-hidden="true" className="filter-controls__icon" size={15} />
      <input type="search" {...props} />
    </label>
  );
}

export type FilterOption = {
  label: string;
  value: string;
};

export function FilterSelect({
  className = "",
  label,
  options,
  placeholder,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: readonly FilterOption[];
  placeholder?: string;
}) {
  return (
    <label className={`filter-controls__select ${className}`.trim()}>
      {label ? <span className="sr-only">{label}</span> : null}
      <select {...props}>
        {placeholder !== undefined ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className="filter-controls__chevron" size={15} />
    </label>
  );
}

export function FilterSubmitButton({
  children = "Filtrar",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button className={`filter-controls__submit ${className}`.trim()} type="submit">
      <SlidersHorizontal aria-hidden="true" size={14} />
      <span>{children}</span>
    </button>
  );
}
