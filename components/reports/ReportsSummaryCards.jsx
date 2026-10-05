import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

const REPORT_SUMMARY_CARD_TONE_CLASS = {
  sales: "border-teal-200/80",
  purchases: "border-sky-200/80",
  positiveNet: "border-emerald-200/80",
  negativeNet: "border-rose-200/80",
  movements: "border-amber-200/80",
};

export function ReportsSummaryCards({ loading, cards }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className={`${REPORT_SUMMARY_CARD_TONE_CLASS[card.tone] || ""} shadow-none`}>
          <CardContent className="pt-0">
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {loading ? <Skeleton className="inline-block h-8 w-32" /> : card.value}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {loading ? <Skeleton className="inline-block h-4 w-24" /> : card.note}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
