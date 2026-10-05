import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ActiveStatusBadge } from "../common/ActiveStatusBadge";
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
import { formatCurrency, formatNumber } from "../../lib/formatters";

export function ProductListTable({ loading, products, isOwner, searchQuery, onDelete }) {
  return (
    <Card className="p-0">
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader className="bg-muted/40 text-foreground">
            <TableRow className="border-t-0">
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Harga Jual</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {loading ? (
              <TableSkeleton columns={6} />
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell className="text-muted-foreground" colSpan={6}>
                  {searchQuery ? "Tidak ada produk yang cocok dengan pencarian." : "Belum ada data produk."}
                </TableCell>
              </TableRow>
            ) : (
              products.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku} • {item.unit}</p>
                    </div>
                  </TableCell>
                  <TableCell>{item.categoryName}</TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p>{formatNumber(item.stock)}</p>
                      <p className="text-xs text-muted-foreground">Min {formatNumber(item.minStock)}</p>
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(item.sellPrice)}</TableCell>
                  <TableCell>
                    <ActiveStatusBadge isActive={item.isActive} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/products/${item.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          Detail
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/admin/products/edit/${item.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                          Ubah
                        </Link>
                      </Button>
                      {isOwner ? (
                        <Button variant="destructive" size="sm" onClick={() => onDelete(item)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
