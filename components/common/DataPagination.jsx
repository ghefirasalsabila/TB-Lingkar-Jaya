import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Build a compact list of page tokens with ellipsis.
 * Example (current=5, total=10, sibling=1):
 *   [1, "…", 4, 5, 6, "…", 10]
 */
function buildPageTokens(currentPage, totalPages, siblingCount = 1) {
  if (totalPages <= 1) return [1];

  const firstPage = 1;
  const lastPage = totalPages;
  const leftSibling = Math.max(currentPage - siblingCount, firstPage);
  const rightSibling = Math.min(currentPage + siblingCount, lastPage);

  const showLeftEllipsis = leftSibling > firstPage + 1;
  const showRightEllipsis = rightSibling < lastPage - 1;

  const tokens = [];
  tokens.push(firstPage);

  if (showLeftEllipsis) {
    tokens.push("ellipsis-left");
  } else {
    for (let page = firstPage + 1; page < leftSibling; page += 1) {
      tokens.push(page);
    }
  }

  for (let page = leftSibling; page <= rightSibling; page += 1) {
    if (page !== firstPage && page !== lastPage) tokens.push(page);
  }

  if (showRightEllipsis) {
    tokens.push("ellipsis-right");
  } else {
    for (let page = rightSibling + 1; page < lastPage; page += 1) {
      tokens.push(page);
    }
  }

  if (lastPage !== firstPage) tokens.push(lastPage);

  return tokens;
}

/**
 * DataPagination: shadcn Pagination wired for client-side paging.
 * Hides itself when there is only a single page. Renders nothing for empty data.
 */
export function DataPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  siblingCount = 1,
  className,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const tokens = useMemo(
    () => buildPageTokens(page, totalPages, siblingCount),
    [page, totalPages, siblingCount],
  );

  if (totalItems === 0 || totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  function goTo(nextPage) {
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped !== page) onPageChange?.(clamped);
  }

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text="Sebelumnya"
            href="#"
            aria-disabled={!canPrev}
            className={!canPrev ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault();
              if (canPrev) goTo(page - 1);
            }}
          />
        </PaginationItem>

        {tokens.map((token) =>
          typeof token === "string" ? (
            <PaginationItem key={token}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={token}>
              <PaginationLink
                href="#"
                isActive={token === page}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(token);
                }}
              >
                {token}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            text="Berikutnya"
            href="#"
            aria-disabled={!canNext}
            className={!canNext ? "pointer-events-none opacity-50" : undefined}
            onClick={(event) => {
              event.preventDefault();
              if (canNext) goTo(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
