import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartSkeleton } from "./DashboardSkeletons";
import { DonutTooltip } from "./DashboardTooltips";
import { formatNumber } from "../../lib/formatters";

const MOBILE_BREAKPOINT = 480;

export function DashboardCategoryDistributionCard({ loading, totalStock, categoryStockData }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewportState = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    updateViewportState();
    window.addEventListener("resize", updateViewportState);

    return () => {
      window.removeEventListener("resize", updateViewportState);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sebaran Stok per Kategori</CardTitle>
        <CardDescription>
          Komposisi stok aktif per kategori ({formatNumber(totalStock)} total unit).
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton height={320} />
        ) : categoryStockData.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Belum ada data kategori.</p>
        ) : (
          <ResponsiveContainer width="100%" height={isMobile ? 420 : 320}>
            <PieChart>
              <Pie
                data={categoryStockData}
                cx="50%"
                cy={isMobile ? "40%" : "50%"}
                innerRadius={70}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                strokeWidth={2}
                stroke="var(--color-card)"
              >
                {categoryStockData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <RechartsTooltip content={<DonutTooltip />} />
              <Legend
                layout={isMobile ? "horizontal" : "vertical"}
                verticalAlign={isMobile ? "bottom" : "middle"}
                align={isMobile ? "center" : "right"}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "13px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
