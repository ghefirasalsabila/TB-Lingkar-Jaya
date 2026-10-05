import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useDashboardLowStockToast(summary, loading) {
  const toastFired = useRef(false);

  useEffect(() => {
    if (loading || toastFired.current || !summary) {
      return;
    }

    toastFired.current = true;
    const lowStock = summary?.lowStockProducts || [];

    if (lowStock.length > 0) {
      toast.warning(`${lowStock.length} produk stok rendah!`, {
        description: lowStock.map((item) => item.name).join(", "),
        duration: 8000,
      });
    }
  }, [loading, summary]);
}
