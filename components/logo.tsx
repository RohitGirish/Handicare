import Link from "next/link"
import { HeartHandshake } from "lucide-react"
import { cn } from "@/lib/utils"

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 rounded-lg", className)} aria-label="HandiCare home">
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl",
          inverted ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground",
        )}
      >
        <HeartHandshake className="size-5" aria-hidden="true" />
      </span>
      <span className={cn("font-heading text-xl font-semibold tracking-tight", inverted && "text-primary-foreground")}>
        HandiCare
      </span>
    </Link>
  )
}
