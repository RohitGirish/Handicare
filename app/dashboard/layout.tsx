import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="user">{children}</DashboardShell>
}
