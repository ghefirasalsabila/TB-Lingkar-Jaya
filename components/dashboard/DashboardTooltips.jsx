import { HEALTH_COLORS } from "../../features/dashboard/constants";
import { formatNumber } from "../../lib/formatters";

export function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{data.name}</p>
      <p className="text-muted-foreground">{formatNumber(data.value)} unit</p>
    </div>
  );
}

export function ProductStockTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  const healthLabel = item.health === "critical"
    ? "Harus Restock"
    : item.health === "warning"
      ? "Hampir Habis"
      : "Stok Aman";

  return (
    <div className="rounded-lg border bg-card px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{item.name}</p>
      <p className="text-muted-foreground">Stok: {formatNumber(item.stock)} {item.unit}</p>
      <p className="text-muted-foreground">Ambang: {formatNumber(item.threshold)}</p>
      <p style={{ color: HEALTH_COLORS[item.health] }}>{healthLabel}</p>
    </div>
  );
}
