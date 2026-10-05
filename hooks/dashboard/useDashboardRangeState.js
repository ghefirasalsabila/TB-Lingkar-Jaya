import { toast } from "sonner";
import { useMemo, useRef, useState } from "react";
import { getLastNDaysRange, resolveDashboardRangeFromPreset, toMonthInput } from "../../features/dashboard/dashboard-range-utils";

export function useDashboardRangeState() {
  const now = useMemo(() => new Date(), []);
  const defaultRange = useMemo(() => getLastNDaysRange(30, now), [now]);
  const [periodPreset, setPeriodPreset] = useState("last30");
  const [selectedMonth, setSelectedMonth] = useState(toMonthInput(now));
  const [customRange, setCustomRange] = useState(defaultRange);
  const [appliedRange, setAppliedRange] = useState(defaultRange);
  const productStockRef = useRef(null);
  const topProductsRef = useRef(null);
  const trendChartsRef = useRef(null);

  function applyDashboardRange(nextRange, callbacks = {}) {
    callbacks.onBeforeApply?.();
    setAppliedRange(nextRange);
  }

  function handlePresetChange(nextPreset, callbacks = {}) {
    setPeriodPreset(nextPreset);

    if (nextPreset === "custom") {
      return;
    }

    applyDashboardRange(
      resolveDashboardRangeFromPreset(nextPreset, {
        referenceDate: now,
        monthValue: selectedMonth,
        customRange,
      }),
      callbacks,
    );
  }

  function handleMonthChange(value, callbacks = {}) {
    setSelectedMonth(value);

    if (periodPreset !== "month") {
      return;
    }

    applyDashboardRange(
      resolveDashboardRangeFromPreset("month", {
        referenceDate: now,
        monthValue: value,
      }),
      callbacks,
    );
  }

  function handleCustomRangeChange(field, value) {
    setCustomRange((previous) => ({ ...previous, [field]: value }));
  }

  function handleCustomRangeApply(callbacks = {}) {
    if (!customRange.from || !customRange.to) {
      toast.error("Lengkapi tanggal mulai dan tanggal akhir.");
      return;
    }

    if (customRange.from > customRange.to) {
      toast.error("Tanggal mulai tidak boleh melewati tanggal akhir.");
      return;
    }

    applyDashboardRange(
      resolveDashboardRangeFromPreset("custom", { customRange }),
      callbacks,
    );
  }

  function scrollTo(ref) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return {
    periodPreset,
    selectedMonth,
    customRange,
    appliedRange,
    productStockRef,
    topProductsRef,
    trendChartsRef,
    handlePresetChange,
    handleMonthChange,
    handleCustomRangeChange,
    handleCustomRangeApply,
    openProductsChart: () => scrollTo(productStockRef),
    openTopProducts: () => scrollTo(topProductsRef),
    openTrendCharts: () => scrollTo(trendChartsRef),
  };
}
