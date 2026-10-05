import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

const toneMap = {
  default: "default",
  destructive: "destructive",
  success: "success",
}

export function StatusAlert({ message, tone = "default", className }) {
  if (!message) return null

  return (
    <Alert variant={toneMap[tone] || "default"} className={cn(className)}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
