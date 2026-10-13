import Link from "next/link"
import { Logo } from "@/components/logo"

const COLUMNS = [
  {
    title: "Get help",
    links: [
      { href: "/register", label: "Create an account" },
      { href: "/dashboard/new-request", label: "Request assistance" },
      { href: "/emergency", label: "Emergency contacts" },
    ],
  },
  {
    title: "Volunteer",
    links: [
      { href: "/register?role=volunteer", label: "Become a volunteer" },
      { href: "/login", label: "Volunteer sign in" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/feedback", label: "Share feedback" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo inverted />
          <p className="max-w-xs leading-relaxed text-background/70">
            Connecting people with disabilities to caring, verified volunteers in their community.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-background/60 uppercase">{col.title}</h2>
            <ul className="flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-background/90 underline-offset-4 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-background/15">
        <p className="mx-auto max-w-6xl px-4 py-6 text-sm text-background/60 md:px-6">
          {"© "}
          {new Date().getFullYear()} HandiCare. In an emergency, always call your local emergency number first.
        </p>
      </div>
    </footer>
  )
}
