"use client"

import { useState } from "react"
import useSWR from "swr"
import { CheckCircle2, HandHeart, Inbox, PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { EmptyState, ListSkeleton, PageHeader } from "@/components/dashboard/dashboard-shell"
import { RequestCard } from "@/components/dashboard/request-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSession } from "@/hooks/use-session"
import { acceptRequest, getAssignedRequests, getAvailableRequests, updateAssignedStatus } from "@/lib/api"
import type { RequestStatus } from "@/lib/types"

export default function VolunteerPage() {
  const { user } = useSession()
  const available = useSWR("available-requests", getAvailableRequests)
  const assigned = useSWR("assigned-requests", getAssignedRequests)
  const [busyId, setBusyId] = useState<number | null>(null)

  async function run(id: number, action: () => Promise<void>, message: string) {
    setBusyId(id)
    try {
      await action()
      await Promise.all([available.mutate(), assigned.mutate()])
      toast.success(message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setBusyId(null)
    }
  }

  const setStatus = (id: number, status: RequestStatus, msg: string) =>
    run(id, () => updateAssignedStatus(id, status), msg)

  const activeAssigned = assigned.data?.filter((r) => r.status !== "completed" && r.status !== "cancelled") ?? []
  const completed = assigned.data?.filter((r) => r.status === "completed").length ?? 0

  return (
    <>
      <PageHeader
        title={`Thanks for helping, ${user?.name.split(" ")[0] ?? "friend"}`}
        description="Pick up open requests nearby and keep your tasks up to date."
      />

      <dl className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Open requests", value: available.data?.length ?? 0 },
          { label: "My active tasks", value: activeAssigned.length },
          { label: "Completed", value: completed },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border bg-card p-5">
            <dt className="text-muted-foreground">{s.label}</dt>
            <dd className="font-heading text-3xl font-semibold">{s.value}</dd>
          </div>
        ))}
      </dl>

      <Tabs defaultValue="available" className="gap-4">
        <TabsList className="h-11">
          <TabsTrigger value="available" className="px-4 text-base">
            Open requests
          </TabsTrigger>
          <TabsTrigger value="assigned" className="px-4 text-base">
            My tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="flex flex-col gap-3">
          {available.isLoading ? (
            <ListSkeleton />
          ) : !available.data?.length ? (
            <EmptyState icon={Inbox} title="All caught up" body="There are no open requests right now. Check back soon!" />
          ) : (
            available.data.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                showRequester
                actions={
                  <Button
                    className="h-10"
                    disabled={busyId === r.id}
                    onClick={() => run(r.id, () => acceptRequest(r.id), "Request accepted — thank you!")}
                  >
                    <HandHeart aria-hidden="true" />
                    {busyId === r.id ? "Accepting…" : "Accept request"}
                  </Button>
                }
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="assigned" className="flex flex-col gap-3">
          {assigned.isLoading ? (
            <ListSkeleton />
          ) : !assigned.data?.length ? (
            <EmptyState icon={HandHeart} title="No tasks yet" body="Accept an open request to see it here." />
          ) : (
            assigned.data.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                showRequester
                actions={
                  r.status === "accepted" ? (
                    <Button
                      className="h-10"
                      disabled={busyId === r.id}
                      onClick={() => setStatus(r.id, "in_progress", "Marked as in progress")}
                    >
                      <PlayCircle aria-hidden="true" />
                      Start task
                    </Button>
                  ) : r.status === "in_progress" ? (
                    <Button
                      className="h-10 bg-success text-success-foreground hover:bg-success/90"
                      disabled={busyId === r.id}
                      onClick={() => setStatus(r.id, "completed", "Great work — task completed!")}
                    >
                      <CheckCircle2 aria-hidden="true" />
                      Mark complete
                    </Button>
                  ) : undefined
                }
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </>
  )
}
