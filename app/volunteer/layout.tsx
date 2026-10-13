import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="volunteer">{children}</DashboardShell>
}
