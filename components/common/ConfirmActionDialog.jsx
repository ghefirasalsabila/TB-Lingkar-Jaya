import { Ban, Loader2, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

function getConfirmIcon(confirmLabel = "", pending) {
  if (pending) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (Boolean(confirmLabel.match(/hapus/i))) {
    return <Trash2 className="h-4 w-4" />;
  }

  return <Ban className="h-4 w-4" />;
}

export function ConfirmActionDialog({
  open,
  pending,
  title,
  description,
  confirmLabel,
  pendingLabel = "Memproses...",
  onOpenChange,
  onConfirm,
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!pending) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
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
            {getConfirmIcon(confirmLabel, pending)}
            {pending ? pendingLabel : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
