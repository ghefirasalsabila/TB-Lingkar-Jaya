import { Ban, Loader2, X } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";

export function TransactionVoidDialog({
  open,
  pending,
  title,
  description,
  reason,
  onOpenChange,
  onReasonChange,
  onConfirm,
}) {
  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !pending && onOpenChange(nextOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-2">
          <Label htmlFor="void-reason">Alasan pembatalan</Label>
          <Input
            id="void-reason"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder="Opsional. Jika diisi, minimal 3 kata."
            disabled={pending}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            <X className="h-4 w-4" />
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={(event) => {
              event.preventDefault();
              void onConfirm();
            }}
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
            {pending ? "Memproses..." : "Batalkan Transaksi"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
