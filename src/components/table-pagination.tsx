"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";

function buildPageHref(
  basePath: string,
  page: number,
  searchParams?: Record<string, string | undefined>,
  pageParam = "pagina",
): string {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== pageParam) params.set(key, value);
    }
  }
  if (page > 1) params.set(pageParam, String(page));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

type TablePaginationProps = {
  basePath: string;
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  searchParams?: Record<string, string | undefined>;
  pageParam?: string;
};

export function TablePagination({
  basePath,
  page,
  pageSize,
  totalCount,
  totalPages,
  searchParams,
  pageParam = "pagina",
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  return (
    <nav aria-label="Paginación de tabla" className="table-pagination">
      <p className="table-pagination__range">
        Mostrando {rangeStart}–{rangeEnd} de {totalCount}
      </p>

      <div className="table-pagination__nav">
        {hasPrevious ? (
          <Link
            className="table-pagination__btn"
            href={buildPageHref(basePath, page - 1, searchParams, pageParam)}
          >
            <ChevronLeft aria-hidden="true" size={14} />
            Anterior
          </Link>
        ) : (
          <span aria-disabled="true" className="table-pagination__btn is-disabled">
            <ChevronLeft aria-hidden="true" size={14} />
            Anterior
          </span>
        )}

        {/* key forces the draft to reset whenever the server page changes */}
        <PageJump
          key={page}
          basePath={basePath}
          page={page}
          pageParam={pageParam}
          searchParams={searchParams}
          totalPages={totalPages}
        />

        {hasNext ? (
          <Link
            className="table-pagination__btn table-pagination__btn--primary"
            href={buildPageHref(basePath, page + 1, searchParams, pageParam)}
          >
            Siguiente
            <ChevronRight aria-hidden="true" size={14} />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="table-pagination__btn table-pagination__btn--primary is-disabled"
          >
            Siguiente
            <ChevronRight aria-hidden="true" size={14} />
          </span>
        )}
      </div>
    </nav>
  );
}

function PageJump({
  basePath,
  page,
  pageParam,
  searchParams,
  totalPages,
}: {
  basePath: string;
  page: number;
  pageParam: string;
  searchParams?: Record<string, string | undefined>;
  totalPages: number;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(String(page));

  function commit() {
    const parsed = Number.parseInt(draft, 10);
    if (!Number.isFinite(parsed)) {
      setDraft(String(page));
      return;
    }
    const target = Math.min(Math.max(1, parsed), totalPages);
    setDraft(String(target));
    if (target !== page) {
      router.push(buildPageHref(basePath, target, searchParams, pageParam));
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      // Blurring triggers onBlur -> commit, so navigation happens exactly once.
      event.currentTarget.blur();
    }
  }

  return (
    <label className="table-pagination__jump">
      <span>Página</span>
      <input
        aria-label={`Número de página, de ${totalPages}`}
        className="table-pagination__page-input"
        inputMode="numeric"
        max={totalPages}
        min={1}
        onBlur={commit}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        type="number"
        value={draft}
      />
      <span>de {totalPages}</span>
    </label>
  );
}
