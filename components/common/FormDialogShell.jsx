import { Loader2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function FormDialogShell({
  open,
  onOpenChange,
  title,
  description,
  formId,
  maxWidthClassName = "sm:max-w-md",
  formClassName = "grid gap-4",
  saving,
  submitLabel,
  onSubmit,
  autoComplete,
  children,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={maxWidthClassName}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form id={formId} className={formClassName} noValidate autoComplete={autoComplete} onSubmit={onSubmit}>
          {children}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" form={formId} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Menyimpan..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
