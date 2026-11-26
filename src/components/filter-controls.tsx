import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import type { FormHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function FilterBar({
  children,
  className = "",
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form className={`filter-controls ${className}`.trim()} method="get" {...props}>
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
