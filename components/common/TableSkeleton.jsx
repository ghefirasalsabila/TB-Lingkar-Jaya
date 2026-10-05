import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

const SKELETON_WIDTHS = ["56%", "72%", "64%", "83%", "61%", "77%"];

/**
 * Reusable table skeleton loader for CRUD pages.
 * Renders skeleton rows inside a TableBody.
 * @param {number} rows - Number of skeleton rows (default 10)
 * @param {number} columns - Number of columns per row (default 4)
 */
export function TableSkeleton({ rows = 10, columns = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx}>
              <Skeleton
                className="h-4 w-full"
                style={{ maxWidth: SKELETON_WIDTHS[(rowIdx + colIdx) % SKELETON_WIDTHS.length] }}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
