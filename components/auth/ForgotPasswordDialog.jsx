import { useId } from "react";
import { Loader2, Send, Mail } from "lucide-react";
import { useForgotPasswordDialog } from "../../hooks/auth/useForgotPasswordDialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function ForgotPasswordDialog({ open, onOpenChange, initialEmail = "" }) {
  const dialogState = useForgotPasswordDialog({ open, onOpenChange, initialEmail });
  const emailFieldId = useId();

  return (
    <Dialog open={open} onOpenChange={dialogState.handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center">Reset Kata Sandi</DialogTitle>
          <DialogDescription className="text-center">
            Masukkan email akun Anda. Sistem akan mengirim tautan reset password ke email tersebut.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" noValidate onSubmit={dialogState.handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={emailFieldId}>Email</Label>
            <Input
              id={emailFieldId}
              type="email"
              placeholder="nama@email.com"
              value={dialogState.email}
              onChange={(event) => dialogState.setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Link reset akan mengarah ke halaman reset password aplikasi ini.
          </p>
          <Button type="submit" className="w-full" disabled={dialogState.loading}>
            {dialogState.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Kirim Link Reset
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
