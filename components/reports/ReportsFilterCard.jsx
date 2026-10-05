import { useId } from "react";
import { Download, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { reportTypeOptions } from "../../features/reports/report-utils";

export function ReportsFilterCard({
  range,
  reportType,
  activeRangeLabel,
  loading,
  downloading,
  onRangeChange,
  onReportTypeChange,
  onSubmit,
  onDownloadPdf,
}) {
  const fromFieldId = useId();
  const toFieldId = useId();
  const reportTypeFieldId = useId();

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Laporan</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeRangeLabel}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" className="h-8 shrink-0 text-xs" onClick={onDownloadPdf} disabled={downloading}>
          <Download className="h-3.5 w-3.5" />
          {downloading ? "Mengunduh..." : "Unduh PDF"}
        </Button>
      </div>

      <form className="flex flex-wrap items-end gap-3" noValidate onSubmit={onSubmit}>
        <div>
          <Label htmlFor={fromFieldId} className="mb-1.5 block text-xs">Dari</Label>
          <Input id={fromFieldId} type="date" value={range.from} onChange={(event) => onRangeChange("from", event.target.value)} className="h-9 w-auto text-xs" />
        </div>
        <div>
          <Label htmlFor={toFieldId} className="mb-1.5 block text-xs">Sampai</Label>
          <Input id={toFieldId} type="date" value={range.to} onChange={(event) => onRangeChange("to", event.target.value)} className="h-9 w-auto text-xs" />
        </div>
        <div>
          <Label htmlFor={reportTypeFieldId} className="mb-1.5 block text-xs">Jenis</Label>
          <Select
            id={reportTypeFieldId}
            value={reportType}
            onChange={(event) => onReportTypeChange(event.target.value)}
            options={reportTypeOptions}
            className="h-9 w-auto min-w-[140px] text-xs"
          />
        </div>
        <Button type="submit" size="sm" className="h-9 text-xs" disabled={loading}>
          <Filter className="h-3.5 w-3.5" />
          {loading ? "Memuat..." : "Terapkan"}
        </Button>
      </form>
    </div>
  );
}
