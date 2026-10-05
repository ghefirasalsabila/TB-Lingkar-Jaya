import { Check, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

export function ProfileEmailChangeNoticeDialog({
  open,
  onOpenChange,
  currentEmail,
  newEmail,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cek Dua Inbox Email</DialogTitle>
          <DialogDescription>
            Permintaan perubahan email sudah dibuat. Alamat login belum berubah sampai kedua email dikonfirmasi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium text-foreground">1. Buka email lama</p>
                  <p className="text-muted-foreground">{currentEmail || "-"}</p>
                  <p className="mt-1 text-muted-foreground">
                    Klik tautan persetujuan untuk memastikan perubahan ini memang Anda yang meminta.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-foreground">2. Buka email baru</p>
                  <p className="text-muted-foreground">{newEmail || "-"}</p>
                  <p className="mt-1 text-muted-foreground">
                    Klik tautan verifikasi agar sistem tahu email baru ini benar-benar milik Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/20 dark:text-emerald-100">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-4 w-4" />
              <div className="space-y-1">
                <p className="font-medium">Kapan email login berubah?</p>
                <p>Email login baru aktif hanya setelah dua tautan di atas selesai dikonfirmasi.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            <Check className="h-4 w-4" />
            Mengerti
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
