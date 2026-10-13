import { Info } from "lucide-react"
import { isDemoMode } from "@/lib/api"

export function DemoBanner() {
  if (!isDemoMode) return null
  return (
    <div role="note" className="flex items-start gap-3 rounded-xl border border-warning/40 bg-accent/60 p-4 text-accent-foreground">
      <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <p className="leading-relaxed">
        <strong>Demo mode.</strong> You&apos;re exploring with sample data. Set{" "}
        <code className="rounded bg-background/70 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_BACKEND_URL</code> to your
        Express server to use real accounts.
      </p>
    </div>
  )
}
