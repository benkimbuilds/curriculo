import type { ReactNode } from "react";

export function CountPill({
  children,
  className = "",
  icon,
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span className={`count-pill ${className}`.trim()}>
      {icon ? (
        <span aria-hidden="true" className="count-pill__icon">
          {icon}
        </span>
      ) : null}
      {children}
    </span>
  );
}
