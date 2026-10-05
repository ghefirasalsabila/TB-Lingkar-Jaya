import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartSkeleton } from "./DashboardSkeletons";
import { ProductStockTooltip } from "./DashboardTooltips";
import { HEALTH_COLORS } from "../../features/dashboard/constants";
import { formatNumber } from "../../lib/formatters";

export function DashboardProductStockSection({ loading, products }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-baseline justify-between gap-3">
          <CardTitle>Stok per Produk</CardTitle>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: HEALTH_COLORS.safe }} /> Aman
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: HEALTH_COLORS.warning }} /> Hampir Habis
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: HEALTH_COLORS.critical }} /> Harus Restock
            </span>
          </div>
        </div>
        <CardDescription>
          Semua produk aktif ditampilkan dalam diagram batang. Geser ke samping untuk melihat semua.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton height={320} />
        ) : products.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data produk.</p>
        ) : (
          <div className="overflow-x-auto">
            <div style={{ width: Math.max(products.length * 56, 560), minWidth: "100%" }}>
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={products} margin={{ top: 20, right: 10, bottom: 70, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-40} textAnchor="end" interval={0} height={90} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RechartsTooltip content={<ProductStockTooltip />} />
                  <Bar dataKey="stock" radius={[4, 4, 0, 0]} barSize={28} minPointSize={3}>
                    {products.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={entry.fill} />
                    ))}
                    <LabelList
                      dataKey="stock"
                      position="top"
                      formatter={(value) => formatNumber(value)}
                      style={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
