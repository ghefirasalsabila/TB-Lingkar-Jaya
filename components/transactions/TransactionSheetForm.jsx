import { Loader2, Save, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { formatCurrency } from "../../lib/formatters";

function getSubmitIcon(saving) {
  if (saving) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  return <Save className="h-4 w-4" />;
}

export function TransactionSheetForm({
  open,
  onOpenChange,
  formId,
  title,
  description,
  onSubmit,
  estimatedTotal,
  saving,
  onCancel,
  submitLabel,
  children,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 overflow-hidden p-0 sm:max-w-xl lg:max-w-2xl">
        <SheetHeader className="border-b px-4 py-5 pr-14 sm:px-6">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <form id={formId} className="flex min-h-0 flex-1 flex-col overflow-hidden" noValidate onSubmit={onSubmit}>
          <div className="min-h-0 flex-1 overflow-y-auto" data-transaction-sheet-body>
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-5 pb-6 sm:px-6">
              {children}

              <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                Estimasi total: <span className="font-semibold text-foreground">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>
          </div>
        </form>

        <SheetFooter className="mt-0 border-t bg-background/95 px-4 py-4 supports-backdrop-filter:backdrop-blur sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" form={formId} disabled={saving}>
            {getSubmitIcon(saving)}
            {saving ? "Menyimpan..." : submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
