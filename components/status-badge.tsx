import { STATUS_META } from "@/lib/labels"
import type { RequestStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: RequestStatus }) {
  const meta = STATUS_META[status] ?? STATUS_META.pending
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold", meta.className)}>
      {meta.label}
    </span>
  )
}

export function UrgentBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-sm font-semibold text-destructive">
      Urgent
    </span>
  )
}
