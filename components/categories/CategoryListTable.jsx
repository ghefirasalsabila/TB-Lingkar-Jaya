import { Pencil, Trash2 } from "lucide-react";
import { ActiveStatusBadge } from "../common/ActiveStatusBadge";
import { DataPagination } from "../common/DataPagination";
import { TableSkeleton } from "../common/TableSkeleton";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CATEGORIES_DEFAULT_LIMIT } from "../../features/categories/category-form-utils";

export function CategoryListTable({ loading, categories, isOwner, searchQuery, paginationMeta, page, onPageChange, onEdit, onDelete }) {
  return (
    <>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[540px]">
            <TableHeader className="bg-muted/40 text-foreground">
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Status</TableHead>
                {isOwner ? <TableHead>Aksi</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton columns={isOwner ? 3 : 2} />
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={isOwner ? 3 : 2}>
                    {searchQuery ? "Tidak ada kategori yang cocok dengan pencarian." : "Belum ada data kategori."}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">{item.name}</TableCell>
                    <TableCell>
                      <ActiveStatusBadge isActive={item.isActive} />
                    </TableCell>
                    {isOwner ? (
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                            Ubah
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <DataPagination
        page={page}
        pageSize={paginationMeta.limit || CATEGORIES_DEFAULT_LIMIT}
        totalItems={paginationMeta.totalItems}
        onPageChange={onPageChange}
      />
    </>
  );
}
