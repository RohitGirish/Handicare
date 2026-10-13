"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  ClipboardList,
  HandHeart,
  LayoutDashboard,
  Loader2,
  LogOut,
  MessageSquareHeart,
  Phone,
  PlusCircle,
  ShieldCheck,
  Users,
} from "lucide-react"
import { DemoBanner } from "@/components/demo-banner"
import { Logo } from "@/components/logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { dashboardPath, useSession } from "@/hooks/use-session"
import { logout } from "@/lib/api"
import { initials } from "@/lib/labels"
import type { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

const NAV: Record<Role, { href: string; label: string; icon: typeof Users }[]> = {
  user: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/new-request", label: "New request", icon: PlusCircle },
    { href: "/dashboard/requests", label: "My requests", icon: ClipboardList },
    { href: "/dashboard/contacts", label: "Emergency contacts", icon: Phone },
    { href: "/dashboard/feedback", label: "Rate volunteers", icon: MessageSquareHeart },
  ],
  volunteer: [{ href: "/volunteer", label: "Requests", icon: HandHeart }],
  admin: [{ href: "/admin", label: "Admin console", icon: ShieldCheck }],
}

const ROLE_LABEL: Record<Role, string> = { user: "Member", volunteer: "Volunteer", admin: "Administrator" }

export function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user, isLoading, mutate } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return
    if (!user) router.replace("/login")
    else if (user.role !== role) router.replace(dashboardPath(user.role))
  }, [isLoading, user, role, router])

  async function handleLogout() {
    await logout()
    await mutate(null, { revalidate: false })
    router.push("/")
  }

  if (isLoading || !user || user.role !== role) {
    return (
      <div className="flex min-h-dvh items-center justify-center" role="status">
        <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Loading your dashboard</span>
      </div>
    )
  }

  const nav = NAV[role]

  return (
    <div className="min-h-dvh md:grid md:grid-cols-[17rem_1fr]">
      <aside className="border-b bg-sidebar md:sticky md:top-0 md:h-dvh md:border-r md:border-b-0">
        <div className="flex h-full flex-col gap-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
              aria-label="Sign out"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Dashboard" className="-mx-1 overflow-x-auto md:mx-0 md:overflow-visible">
            <ul className="flex gap-1 px-1 md:flex-col md:px-0">
              {nav.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base whitespace-nowrap transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent",
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                )
              })}
              {role === "user" && (
                <li className="md:mt-4">
                  <Link
                    href="/emergency"
                    className="flex items-center gap-3 rounded-lg bg-destructive/10 px-3 py-2.5 text-base font-semibold whitespace-nowrap text-destructive hover:bg-destructive/15"
                  >
                    <Phone className="size-5" aria-hidden="true" />
                    Emergency
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-auto hidden items-center gap-3 border-t pt-4 md:flex">
            <Avatar className="size-10">
              <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{ROLE_LABEL[role]}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      <main id="main" className="min-w-0 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
          <DemoBanner />
          {children}
        </div>
      </main>
    </div>
  )
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-lg text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, body, action }: {
  icon: typeof Users
  title: string
  body: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="max-w-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  )
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-32 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  )
}
