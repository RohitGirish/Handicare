import type { RequestStatus, RequestType } from "./types"

export const REQUEST_TYPES: { value: RequestType; label: string }[] = [
  { value: "shopping", label: "Grocery Shopping" },
  { value: "medical", label: "Medical Appointment" },
  { value: "housework", label: "Housework" },
  { value: "transportation", label: "Transportation" },
  { value: "companionship", label: "Companionship" },
  { value: "other", label: "Other" },
]

export function requestTypeLabel(type: string) {
  return REQUEST_TYPES.find((t) => t.value === type)?.label ?? type
}

export const STATUS_META: Record<RequestStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-accent text-accent-foreground" },
  accepted: { label: "Accepted", className: "bg-secondary text-secondary-foreground" },
  in_progress: { label: "In progress", className: "bg-primary/10 text-primary" },
  completed: { label: "Completed", className: "bg-success/15 text-success" },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground" },
}

export function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
}

export function formatTime(value: string) {
  const [h, m] = value.split(":").map(Number)
  if (Number.isNaN(h)) return value
  const d = new Date()
  d.setHours(h, m || 0)
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}
