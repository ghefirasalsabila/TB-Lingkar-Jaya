import { Pencil, Trash2 } from "lucide-react";
import { ActiveStatusBadge } from "../common/ActiveStatusBadge";
import { DataPagination } from "../common/DataPagination";
import { TableSkeleton } from "../common/TableSkeleton";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { SUPPLIERS_DEFAULT_LIMIT } from "../../features/suppliers/supplier-form-utils";

export function SupplierListTable({ loading, suppliers, isOwner, searchQuery, paginationMeta, page, onPageChange, onEdit, onDelete }) {
  return (
    <>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[680px]">
            <TableHeader className="bg-muted/40 text-foreground">
              <TableRow>
                <TableHead>Nama Supplier</TableHead>
                <TableHead>Telepon</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead>Status</TableHead>
                {isOwner ? <TableHead>Aksi</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton columns={isOwner ? 5 : 4} />
              ) : suppliers.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={isOwner ? 5 : 4}>
                    {searchQuery ? "Tidak ada supplier yang cocok dengan pencarian." : "Belum ada data supplier."}
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.categories?.length > 0 ? (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {item.categories.map((category) => (
                            <Badge key={category.id} variant="outline">{category.name}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-xs text-muted-foreground">Belum ada kategori</p>
                      )}
                    </TableCell>
                    <TableCell>{item.phone || "-"}</TableCell>
                    <TableCell>{item.address || "-"}</TableCell>
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
        pageSize={paginationMeta.limit || SUPPLIERS_DEFAULT_LIMIT}
        totalItems={paginationMeta.totalItems}
        onPageChange={onPageChange}
      />
    </>
  );
}
