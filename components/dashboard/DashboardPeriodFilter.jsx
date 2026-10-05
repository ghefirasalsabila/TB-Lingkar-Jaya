import { Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { DASHBOARD_PERIOD_PRESETS } from "../../features/dashboard/constants";

export function DashboardPeriodFilter({
  activeRangeLabel,
  periodPreset,
  selectedMonth,
  customRange,
  onPresetChange,
  onMonthChange,
  onCustomRangeChange,
  onCustomRangeApply,
}) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dasbor</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan stok dan transaksi · {periodPreset === "allTime" ? "Semua waktu" : activeRangeLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={periodPreset}
            onChange={(event) => onPresetChange(event.target.value)}
            className="h-8 w-auto min-w-[140px] text-xs"
            aria-label="Preset periode dasbor"
            options={DASHBOARD_PERIOD_PRESETS}
          />

          {periodPreset === "month" ? (
            <Input
              type="month"
              value={selectedMonth}
              onChange={(event) => onMonthChange(event.target.value)}
              className="h-8 w-auto text-xs"
              aria-label="Pilih bulan dasbor"
            />
          ) : null}

          {periodPreset === "custom" ? (
            <>
              <Input
                type="date"
                value={customRange.from}
                onChange={(event) => onCustomRangeChange("from", event.target.value)}
                className="h-8 w-auto text-xs"
                aria-label="Tanggal awal dasbor"
              />
              <span className="text-xs text-muted-foreground">–</span>
              <Input
                type="date"
                value={customRange.to}
                onChange={(event) => onCustomRangeChange("to", event.target.value)}
                className="h-8 w-auto text-xs"
                aria-label="Tanggal akhir dasbor"
              />
              <Button type="button" size="sm" className="h-8 text-xs" onClick={onCustomRangeApply}>
                <Filter className="h-3.5 w-3.5" />
                Terapkan
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
