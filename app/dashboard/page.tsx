"use client"

import Link from "next/link"
import useSWR from "swr"
import { ArrowRight, CalendarCheck, ClipboardList, Hourglass, Phone, PlusCircle } from "lucide-react"
import { EmptyState, ListSkeleton, PageHeader } from "@/components/dashboard/dashboard-shell"
import { RequestCard } from "@/components/dashboard/request-card"
import { buttonVariants } from "@/components/ui/button"
import { useSession } from "@/hooks/use-session"
import { getContacts, getMyRequests } from "@/lib/api"
import { cn } from "@/lib/utils"

export default function UserOverviewPage() {
  const { user } = useSession()
  const { data: requests, isLoading } = useSWR("my-requests", getMyRequests)
  const { data: contacts } = useSWR("contacts", getContacts)

  const active = requests?.filter((r) => ["pending", "accepted", "in_progress"].includes(r.status)) ?? []
  const stats = [
    { label: "Active requests", value: active.length, icon: Hourglass },
    { label: "Completed", value: requests?.filter((r) => r.status === "completed").length ?? 0, icon: CalendarCheck },
    { label: "Emergency contacts", value: contacts?.length ?? 0, icon: Phone },
  ]

  return (
    <>
      <PageHeader
        title={`Hello, ${user?.name.split(" ")[0] ?? "there"}`}
        description="Here's what's happening with your support."
        action={
          <Link href="/dashboard/new-request" className={cn(buttonVariants(), "h-12 px-5 text-base")}>
            <PlusCircle aria-hidden="true" />
            Request help
          </Link>
        }
      />

      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
            <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-heading text-3xl font-semibold">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <section aria-labelledby="upcoming-title" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="upcoming-title" className="text-2xl font-semibold">
            Upcoming help
          </h2>
          <Link
            href="/dashboard/requests"
            className="flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
          >
            View all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        {isLoading ? (
          <ListSkeleton rows={2} />
        ) : active.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No active requests"
            body="When you need a hand, post a request and a nearby volunteer will pick it up."
            action={
              <Link href="/dashboard/new-request" className={cn(buttonVariants(), "mt-2 h-11 px-5")}>
                Create a request
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {active.slice(0, 3).map((r) => (
              <RequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
