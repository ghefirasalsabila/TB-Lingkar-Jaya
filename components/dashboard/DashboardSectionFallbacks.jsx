import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartSkeleton, SummaryCardSkeleton } from "./DashboardSkeletons";

export function DashboardOverviewSectionFallback() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Sebaran Stok per Kategori</CardTitle>
          <CardDescription>Memuat ringkasan stok aktif per kategori.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartSkeleton height={320} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 content-start gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function DashboardChartSectionFallback({ title, description, height = 320 }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartSkeleton height={height} />
      </CardContent>
    </Card>
  );
}

export function DashboardTrendSectionFallback() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <DashboardChartSectionFallback
        title="Barang Masuk / Keluar"
        description="Memuat tren stok untuk periode aktif."
        height={280}
      />
      <DashboardChartSectionFallback
        title="Uang Masuk / Keluar"
        description="Memuat tren arus uang untuk periode aktif."
        height={280}
      />
    </div>
  );
}
