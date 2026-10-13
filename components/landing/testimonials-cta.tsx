import Link from "next/link"
import { Quote } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const QUOTES = [
  {
    body: "Getting to physio used to be the hardest part of my week. Now I just post a request and someone I trust shows up.",
    name: "John D.",
    role: "Member since 2024",
  },
  {
    body: "Volunteering a few hours on weekends has become the best part of my week. The app makes it easy to find where I'm needed.",
    name: "Sarah J.",
    role: "Volunteer",
  },
]

export function TestimonialsCta() {
  return (
    <section aria-labelledby="community-title" className="bg-secondary/60 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 id="community-title" className="mb-10 text-3xl font-semibold tracking-tight md:text-4xl">
          Kind words from our community
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {QUOTES.map((q) => (
            <figure key={q.name} className="flex flex-col gap-4 rounded-2xl bg-card p-8 shadow-sm">
              <Quote className="size-8 text-primary/40" aria-hidden="true" />
              <blockquote className="text-lg leading-relaxed">{q.body}</blockquote>
              <figcaption>
                <span className="font-semibold">{q.name}</span>
                <span className="text-muted-foreground"> · {q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:p-12">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold md:text-3xl">Ready when you are.</h2>
            <p className="mt-2 text-lg text-primary-foreground/80">
              Join free today — whether you&apos;re looking for help or looking to give it.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "secondary" }), "h-12 px-6 text-base")}
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-primary-foreground/40 px-6 text-base font-medium hover:bg-primary-foreground/10"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
