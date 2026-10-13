"use client"

import Link from "next/link"
import { useState } from "react"
import useSWR from "swr"
import { ClipboardList, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { EmptyState, ListSkeleton, PageHeader } from "@/components/dashboard/dashboard-shell"
import { RequestCard } from "@/components/dashboard/request-card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMyRequests, updateMyRequestStatus } from "@/lib/api"
import { cn } from "@/lib/utils"

const FILTERS = {
  active: ["pending", "accepted", "in_progress"],
  completed: ["completed"],
  cancelled: ["cancelled"],
} as const

type Filter = keyof typeof FILTERS

export default function MyRequestsPage() {
  const { data, isLoading, mutate } = useSWR("my-requests", getMyRequests)
  const [filter, setFilter] = useState<Filter>("active")
  const [busyId, setBusyId] = useState<number | null>(null)

  const visible = (data ?? []).filter((r) => (FILTERS[filter] as readonly string[]).includes(r.status))

  async function cancel(id: number) {
    setBusyId(id)
    try {
      await updateMyRequestStatus(id, "cancelled")
      await mutate()
      toast.success("Request cancelled")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel request")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="My requests"
        description="Track and manage the help you've asked for."
        action={
          <Link href="/dashboard/new-request" className={cn(buttonVariants(), "h-12 px-5 text-base")}>
            <PlusCircle aria-hidden="true" />
            New request
          </Link>
        }
      />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList className="h-11">
          <TabsTrigger value="active" className="px-4 text-base">
            Active
          </TabsTrigger>
          <TabsTrigger value="completed" className="px-4 text-base">
            Completed
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="px-4 text-base">
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <ListSkeleton />
      ) : visible.length === 0 ? (
        <EmptyState icon={ClipboardList} title={`No ${filter} requests`} body="Requests will appear here as they change." />
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              actions={
                r.status === "pending" || r.status === "accepted" ? (
                  <Button
                    variant="outline"
                    className="h-10 text-destructive hover:text-destructive"
                    disabled={busyId === r.id}
                    onClick={() => cancel(r.id)}
                  >
                    {busyId === r.id ? "Cancelling…" : "Cancel request"}
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </>
  )
}
