import type { ReactNode } from "react";

type DataTableColumn = {
  className?: string;
  label: ReactNode;
};

type DataTableProps = {
  children: ReactNode;
  className?: string;
  columns: DataTableColumn[];
};

/** A responsive, accessible table shell for administrative data views. */
export function DataTable({ children, className, columns }: DataTableProps) {
  return (
    <div className={["data-table", className].filter(Boolean).join(" ")}>
      <table>
        <thead>
          <tr>{columns.map((column, index) => <th className={column.className} key={index} scope="col">{column.label}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
