import { Badge } from "../ui/badge";

export function ActiveStatusBadge({ isActive }) {
  return (
    <Badge variant={isActive ? "default" : "secondary"}>
      {isActive ? "Aktif" : "Nonaktif"}
    </Badge>
  );
}
