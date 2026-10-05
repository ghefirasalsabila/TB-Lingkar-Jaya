import {
  ClipboardList,
  FolderTree,
  HandCoins,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  UserSquare2,
} from "lucide-react";
import { isOwnerRole, ROLE_LABELS } from "../../constants/roles";

const adminMenuGroups = [
  {
    title: "Utama",
    items: [{ to: "/admin/dashboard", label: "Dasbor", icon: LayoutDashboard }],
  },
  {
    title: "Inventori",
    items: [
      { to: "/admin/products", label: "Barang", icon: Package },
      { to: "/admin/categories", label: "Kategori", icon: FolderTree },
      { to: "/admin/suppliers", label: "Supplier", icon: Truck },
    ],
  },
  {
    title: "Transaksi",
    items: [
      { to: "/admin/purchases", label: "Pembelian", icon: ShoppingCart },
      { to: "/admin/sales", label: "Penjualan", icon: HandCoins },
    ],
  },
  {
    title: "Lainnya",
    items: [
      { to: "/admin/users", label: "Pengguna", icon: UserSquare2 },
      { to: "/admin/reports", label: "Laporan", icon: ClipboardList },
    ],
  },
];

export function getInitials(name) {
  if (!name) return "U";

  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getVisibleAdminMenuGroups(role) {
  return adminMenuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isOwnerRole(role) || item.to !== "/admin/users"),
    }))
    .filter((group) => group.items.length > 0);
}
