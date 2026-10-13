"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2, MessageSquareHeart } from "lucide-react"
import { toast } from "sonner"
import { EmptyState, ListSkeleton, PageHeader } from "@/components/dashboard/dashboard-shell"
import { fieldClass, selectClass } from "@/components/form-field"
import { StarDisplay, StarRatingInput } from "@/components/star-rating"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getMyFeedback, getVolunteers, submitVolunteerFeedback } from "@/lib/api"
import { formatDate } from "@/lib/labels"
import { cn } from "@/lib/utils"

export default function FeedbackPage() {
  const { data: volunteers } = useSWR("volunteers", getVolunteers)
  const { data: feedback, isLoading, mutate } = useSWR("my-feedback", getMyFeedback)
  const [rating, setRating] = useState(5)
  const [isPublic, setIsPublic] = useState(true)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setPending(true)
    try {
      await submitVolunteerFeedback({
        volunteer_id: Number(f.get("volunteer_id")),
        rating,
        comment: String(f.get("comment")).trim(),
        is_public: isPublic,
      })
      await mutate()
      form.reset()
      setRating(5)
      toast.success("Thank you for your feedback!")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit feedback")
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <PageHeader title="Rate volunteers" description="Your feedback keeps our community kind and reliable." />

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        <form onSubmit={handleSubmit} className="flex h-fit flex-col gap-5 rounded-2xl border bg-card p-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="volunteer_id" className="text-base">
              Volunteer
            </Label>
            <select id="volunteer_id" name="volunteer_id" required className={selectClass} defaultValue="">
              <option value="" disabled>
                Choose a volunteer
              </option>
              {volunteers?.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} · ★ {v.stats.averageRating}
                </option>
              ))}
            </select>
          </div>
          <StarRatingInput value={rating} onChange={setRating} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="comment" className="text-base">
              Comments
            </Label>
            <Textarea
              id="comment"
              name="comment"
              rows={4}
              required
              placeholder="What went well? Anything to improve?"
              className={cn(fieldClass, "h-auto min-h-28 py-3")}
            />
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="is_public" checked={isPublic} onCheckedChange={(v) => setIsPublic(v === true)} />
            <Label htmlFor="is_public" className="font-normal">
              Show this review on the volunteer&apos;s profile
            </Label>
          </div>
          <Button type="submit" disabled={pending} className="h-12 text-base">
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Submit feedback
          </Button>
        </form>

        <section aria-labelledby="past-feedback-title" className="flex flex-col gap-3">
          <h2 id="past-feedback-title" className="text-xl font-semibold">
            Your past reviews
          </h2>
          {isLoading ? (
            <ListSkeleton rows={2} />
          ) : !feedback?.length ? (
            <EmptyState icon={MessageSquareHeart} title="No reviews yet" body="After a volunteer helps you, rate them here." />
          ) : (
            <ul className="flex flex-col gap-3">
              {feedback.map((f) => (
                <li key={f.id} className="flex flex-col gap-2 rounded-2xl border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{f.volunteer_name ?? "Volunteer"}</p>
                    <StarDisplay value={f.rating} />
                  </div>
                  <p className="leading-relaxed">{f.comment}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(f.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
