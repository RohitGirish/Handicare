"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, Menu, Phone, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"
import { dashboardPath, useSession } from "@/hooks/use-session"
import { logout } from "@/lib/api"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#services", label: "Services" },
  { href: "/feedback", label: "Feedback" },
]

export function SiteHeader() {
  const { user, mutate } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    await mutate(null, { revalidate: false })
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-base text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                pathname === item.href && "text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/emergency"
            className={cn(buttonVariants({ variant: "destructive" }), "h-10 px-4 text-base")}
          >
            <Phone aria-hidden="true" />
            Emergency
          </Link>
          {user ? (
            <>
              <Link href={dashboardPath(user.role)} className={cn(buttonVariants(), "h-10 px-4 text-base")}>
                My dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-10")}
                aria-label="Sign out"
              >
                <LogOut aria-hidden="true" />
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-4 text-base")}>
                Sign in
              </Link>
              <Link href="/register" className={cn(buttonVariants(), "h-10 px-4 text-base")}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-11 md:hidden")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-lg hover:bg-muted"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <Link
              href="/emergency"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "destructive" }), "h-12 text-base")}
            >
              <Phone aria-hidden="true" />
              Emergency help
            </Link>
            {user ? (
              <>
                <Link
                  href={dashboardPath(user.role)}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "h-12 text-base")}
                >
                  My dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(buttonVariants({ variant: "outline" }), "h-12 text-base")}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "h-12 text-base")}
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "h-12 text-base")}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
