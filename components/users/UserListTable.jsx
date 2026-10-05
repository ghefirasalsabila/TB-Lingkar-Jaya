import { Ban, Pencil } from "lucide-react";
import { ActiveStatusBadge } from "../common/ActiveStatusBadge";
import { DataPagination } from "../common/DataPagination";
import { TableSkeleton } from "../common/TableSkeleton";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { USER_ROLES } from "../../constants/roles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function UserListTable({
  loading,
  users,
  isOwner,
  searchQuery,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onEdit,
  onDeactivate,
}) {
  return (
    <>
      <Card className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader className="bg-muted/40 text-foreground">
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton columns={4} />
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell className="text-muted-foreground" colSpan={4}>
                    {searchQuery ? "Tidak ada pengguna yang cocok dengan pencarian." : "Belum ada data pengguna."}
                  </TableCell>
                </TableRow>
              ) : (
                users.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <ActiveStatusBadge isActive={item.isActive} />
                    </TableCell>
                    <TableCell>
                      {isOwner ? (
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                            <Pencil className="h-3.5 w-3.5" />
                            Ubah
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDeactivate(item)}
                            disabled={item.role === USER_ROLES.OWNER || !item.isActive}
                          >
                            <Ban className="h-3.5 w-3.5" />
                            Nonaktifkan
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Hanya baca</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <DataPagination
        page={page}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
    </>
  );
}
