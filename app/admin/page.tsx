"use client"

import useSWR from "swr"
import { CheckCircle2, ClipboardList, HandHeart, Users } from "lucide-react"
import { AdminTable } from "@/components/admin/admin-table"
import { PageHeader } from "@/components/dashboard/dashboard-shell"
import { StarDisplay } from "@/components/star-rating"
import { StatusBadge } from "@/components/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getAdminFeedback,
  getAdminRequests,
  getAdminStats,
  getAdminUsers,
  getAdminVolunteers,
} from "@/lib/api"
import { formatDate, requestTypeLabel } from "@/lib/labels"

export default function AdminPage() {
  const { data: stats } = useSWR("admin-stats", () => getAdminStats("all"))

  const cards = [
    { label: "Members", value: stats?.userCount, icon: Users },
    { label: "Volunteers", value: stats?.volunteerCount, icon: HandHeart },
    { label: "Requests", value: stats?.requestCount, icon: ClipboardList },
    { label: "Completed", value: stats?.completedCount, icon: CheckCircle2 },
  ]

  return (
    <>
      <PageHeader title="Admin console" description="Oversee members, volunteers, requests and feedback." />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex flex-col gap-3 rounded-2xl border bg-card p-5">
            <Icon className="size-6 text-primary" aria-hidden="true" />
            <div>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-heading text-3xl font-semibold">{value ?? "—"}</dd>
            </div>
          </div>
        ))}
      </dl>

      <Tabs defaultValue="requests" className="gap-4">
        <TabsList className="h-11 w-full justify-start overflow-x-auto sm:w-fit">
          <TabsTrigger value="requests" className="px-4 text-base">Requests</TabsTrigger>
          <TabsTrigger value="users" className="px-4 text-base">Members</TabsTrigger>
          <TabsTrigger value="volunteers" className="px-4 text-base">Volunteers</TabsTrigger>
          <TabsTrigger value="feedback" className="px-4 text-base">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <AdminTable
            kind="requests"
            fetcher={getAdminRequests}
            columns={[
              { header: "Request", cell: (r) => <span className="font-semibold">{r.title}</span> },
              { header: "Type", cell: (r) => requestTypeLabel(r.type) },
              { header: "Member", cell: (r) => r.user_name ?? "—" },
              { header: "Volunteer", cell: (r) => r.volunteer_name ?? "Unassigned" },
              { header: "Date", cell: (r) => formatDate(r.date) },
              { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
            ]}
            labelOf={(r) => r.title}
          />
        </TabsContent>
        <TabsContent value="users">
          <AdminTable
            kind="users"
            fetcher={getAdminUsers}
            columns={[
              { header: "Name", cell: (u) => <span className="font-semibold">{u.name}</span> },
              { header: "Email", cell: (u) => u.email },
              { header: "Phone", cell: (u) => u.phone },
              { header: "Support needs", cell: (u) => u.disability ?? "—" },
              { header: "Joined", cell: (u) => formatDate(u.created_at) },
            ]}
            labelOf={(u) => u.name}
          />
        </TabsContent>
        <TabsContent value="volunteers">
          <AdminTable
            kind="volunteers"
            fetcher={getAdminVolunteers}
            columns={[
              { header: "Name", cell: (v) => <span className="font-semibold">{v.name}</span> },
              { header: "Email", cell: (v) => v.email },
              { header: "Skills", cell: (v) => v.skills ?? "—" },
              { header: "Availability", cell: (v) => v.availability ?? "—" },
              { header: "Joined", cell: (v) => formatDate(v.created_at) },
            ]}
            labelOf={(v) => v.name}
          />
        </TabsContent>
        <TabsContent value="feedback">
          <AdminTable
            kind="feedback"
            fetcher={getAdminFeedback}
            columns={[
              { header: "Volunteer", cell: (f) => <span className="font-semibold">{f.volunteer_name ?? "—"}</span> },
              { header: "From", cell: (f) => f.user_name ?? "—" },
              { header: "Rating", cell: (f) => <StarDisplay value={f.rating} /> },
              { header: "Comment", cell: (f) => <span className="line-clamp-2 max-w-xs">{f.comment}</span> },
              { header: "Date", cell: (f) => formatDate(f.created_at) },
            ]}
            labelOf={(f) => `feedback #${f.id}`}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}
