"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useSWRConfig } from "swr"
import { Car, HeartPulse, Home, Loader2, MessageCircleHeart, ShoppingBasket, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/dashboard/dashboard-shell"
import { FormField, fieldClass, selectClass } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createRequest } from "@/lib/api"
import { REQUEST_TYPES } from "@/lib/labels"
import type { RequestType } from "@/lib/types"
import { cn } from "@/lib/utils"

const TYPE_ICONS: Record<RequestType, typeof Car> = {
  shopping: ShoppingBasket,
  medical: HeartPulse,
  housework: Home,
  transportation: Car,
  companionship: MessageCircleHeart,
  other: Sparkles,
}

const DURATIONS = [1, 2, 3, 4, 6, 8]

export default function NewRequestPage() {
  const router = useRouter()
  const { mutate } = useSWRConfig()
  const [type, setType] = useState<RequestType>("shopping")
  const [urgent, setUrgent] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setPending(true)
    setError(null)
    try {
      await createRequest({
        title: String(f.get("title")).trim(),
        type,
        date: String(f.get("date")),
        time: String(f.get("time")),
        duration: Number(f.get("duration")),
        location: String(f.get("location")).trim(),
        description: String(f.get("description") ?? "").trim(),
        is_urgent: urgent,
      })
      await mutate("my-requests")
      toast.success("Request posted! We'll let you know when a volunteer accepts.")
      router.push("/dashboard/requests")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create request")
      setPending(false)
    }
  }

  return (
    <>
      <PageHeader title="Request help" description="Tell us what you need and a volunteer nearby will pick it up." />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 rounded-2xl border bg-card p-5 md:p-8">
        <fieldset>
          <legend className="mb-3 text-lg font-semibold">What kind of help do you need?</legend>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {REQUEST_TYPES.map(({ value, label }) => {
              const Icon = TYPE_ICONS[value]
              const selected = type === value
              return (
                <label
                  key={value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 font-semibold transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                    selected ? "border-primary bg-secondary text-secondary-foreground" : "hover:border-primary/40",
                  )}
                >
                  <input
                    type="radio"
                    name="type"
                    value={value}
                    checked={selected}
                    onChange={() => setType(value)}
                    className="sr-only"
                  />
                  <Icon className="size-6 shrink-0" aria-hidden="true" />
                  {label}
                </label>
              )
            })}
          </div>
        </fieldset>

        <FormField label="Short title" name="title" placeholder="e.g. Ride to physiotherapy" required maxLength={120} />

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Date" name="date" type="date" min={today} defaultValue={today} required />
          <FormField label="Time" name="time" type="time" defaultValue="10:00" required />
          <div className="flex flex-col gap-2">
            <Label htmlFor="duration" className="text-base">
              Duration
            </Label>
            <select id="duration" name="duration" defaultValue={1} className={selectClass}>
              {DURATIONS.map((d) => (
                <option key={d} value={d}>
                  {d} hour{d > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <FormField label="Location" name="location" placeholder="Address or meeting point" required />

        <div className="flex flex-col gap-2">
          <Label htmlFor="description" className="text-base">
            Details <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Anything the volunteer should know — accessibility needs, items to bring, parking…"
            className={cn(fieldClass, "h-auto min-h-28 py-3")}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl bg-destructive/5 p-4">
          <div>
            <Label htmlFor="urgent" className="text-base font-semibold">
              This is urgent
            </Label>
            <p className="text-sm text-muted-foreground">Urgent requests are shown first to volunteers.</p>
          </div>
          <Switch id="urgent" checked={urgent} onCheckedChange={setUrgent} />
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-destructive">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" className="h-12 px-6 text-base" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending} className="h-12 px-6 text-base">
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            {pending ? "Posting…" : "Post request"}
          </Button>
        </div>
      </form>
    </>
  )
}
