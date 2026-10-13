"use client"

import { useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"
import { FormField, fieldClass } from "@/components/form-field"
import { StarRatingInput } from "@/components/star-rating"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitGeneralFeedback } from "@/lib/api"
import { cn } from "@/lib/utils"

export function GeneralFeedbackForm() {
  const [rating, setRating] = useState(5)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setPending(true)
    setError(null)
    try {
      await submitGeneralFeedback({
        name: String(f.get("name")).trim(),
        email: String(f.get("email")).trim(),
        feedback: String(f.get("feedback")).trim(),
        rating,
      })
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send feedback")
    } finally {
      setPending(false)
    }
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-10 text-center">
        <CheckCircle2 className="size-12 text-success" aria-hidden="true" />
        <h2 className="text-2xl font-semibold">Thank you!</h2>
        <p className="text-muted-foreground">We read every message and use it to make HandiCare better.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border bg-card p-5 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Your name" name="name" autoComplete="name" required />
        <FormField label="Email" name="email" type="email" autoComplete="email" required />
      </div>
      <StarRatingInput value={rating} onChange={setRating} />
      <div className="flex flex-col gap-2">
        <Label htmlFor="feedback" className="text-base">
          Your message
        </Label>
        <Textarea
          id="feedback"
          name="feedback"
          rows={5}
          required
          className={cn(fieldClass, "h-auto min-h-32 py-3")}
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="h-12 text-base sm:w-fit sm:px-8">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        Send feedback
      </Button>
    </form>
  )
}
