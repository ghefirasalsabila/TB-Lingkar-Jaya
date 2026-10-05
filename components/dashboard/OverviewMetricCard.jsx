import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function OverviewMetricCard({ icon, title, loading, onClick, children }) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardContent className="flex items-start gap-3">
        {icon}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{title}</p>
            <span className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary">
              Lihat Detail <ChevronDown className="h-2.5 w-2.5" />
            </span>
          </div>
          {loading ? <Skeleton className="mt-1 h-6 w-20" /> : children}
        </div>
      </CardContent>
    </Card>
  );
}
