import { useId } from "react";
import { Loader2, Send, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ProfileEmailChangeDialog({
  open,
  onOpenChange,
  newEmail,
  currentPassword,
  loading,
  onNewEmailChange,
  onCurrentPasswordChange,
  onSubmit,
}) {
  const newEmailFieldId = useId();
  const currentPasswordFieldId = useId();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ubah Email Login</DialogTitle>
          <DialogDescription>
            Masukkan email baru dan kata sandi saat ini. Perubahan selesai setelah kedua email dikonfirmasi.
          </DialogDescription>
        </DialogHeader>

        <form id="profile-email-change-form" className="space-y-4" autoComplete="off" noValidate onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor={newEmailFieldId}>Email Baru</Label>
            <Input
              id={newEmailFieldId}
              name="profile-email-change-new-email"
              type="email"
              value={newEmail}
              onChange={(event) => onNewEmailChange(event.target.value)}
              autoComplete="off"
              inputMode="email"
              placeholder="nama@domain.com"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={currentPasswordFieldId}>Kata Sandi Saat Ini</Label>
            <Input
              id={currentPasswordFieldId}
              name="profile-email-change-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => onCurrentPasswordChange(event.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button type="submit" form="profile-email-change-form" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Mengirim..." : "Kirim Tautan Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
