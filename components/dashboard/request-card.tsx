import { Calendar, Clock, MapPin, User } from "lucide-react"
import { StatusBadge, UrgentBadge } from "@/components/status-badge"
import { formatDate, formatTime, requestTypeLabel } from "@/lib/labels"
import type { HelpRequest } from "@/lib/types"
import { cn } from "@/lib/utils"

export function RequestCard({
  request,
  showRequester = false,
  actions,
}: {
  request: HelpRequest
  showRequester?: boolean
  actions?: React.ReactNode
}) {
  const urgent = Boolean(Number(request.is_urgent))
  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-2xl border bg-card p-5 md:p-6",
        urgent && "border-l-4 border-l-destructive",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-primary">{requestTypeLabel(request.type)}</p>
          <h3 className="text-xl font-semibold">{request.title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {urgent && <UrgentBadge />}
          <StatusBadge status={request.status} />
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
        <li className="flex items-center gap-2">
          <Calendar className="size-4" aria-hidden="true" />
          {formatDate(request.date)}
        </li>
        <li className="flex items-center gap-2">
          <Clock className="size-4" aria-hidden="true" />
          {formatTime(request.time)} · {request.duration} hr{request.duration === 1 ? "" : "s"}
        </li>
        <li className="flex items-center gap-2">
          <MapPin className="size-4" aria-hidden="true" />
          {request.location}
        </li>
      </ul>

      {request.description && <p className="leading-relaxed">{request.description}</p>}

      {showRequester && request.requester && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-muted/60 p-3 text-sm">
          <span className="flex items-center gap-2 font-semibold">
            <User className="size-4" aria-hidden="true" />
            {request.requester.name}
          </span>
          {request.requester.disability && (
            <span className="text-muted-foreground">Support needs: {request.requester.disability}</span>
          )}
          {request.requester.phone && <span className="text-muted-foreground">{request.requester.phone}</span>}
        </div>
      )}

      {!showRequester && request.volunteer_name && (
        <p className="flex items-center gap-2 text-sm">
          <User className="size-4 text-primary" aria-hidden="true" />
          Volunteer: <span className="font-semibold">{request.volunteer_name}</span>
        </p>
      )}

      {actions && <div className="flex flex-wrap gap-2 border-t pt-4">{actions}</div>}
    </article>
  )
}
