import type { Metadata } from "next"
import { Ambulance, Flame, HeartPulse, Phone, ShieldAlert } from "lucide-react"
import { MyEmergencyContacts } from "@/components/emergency/my-contacts"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Emergency help" }

const SERVICES = [
  { label: "Emergency services", number: "911", icon: Ambulance, note: "Police, fire, ambulance" },
  { label: "Crisis & suicide lifeline", number: "988", icon: HeartPulse, note: "24/7 confidential support" },
  { label: "Poison control", number: "1-800-222-1222", icon: Flame, note: "Free, expert advice" },
  { label: "Disability rights hotline", number: "1-800-949-4232", icon: ShieldAlert, note: "ADA information line" },
]

export default function EmergencyPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-12 md:px-6">
        <div className="flex flex-col gap-4 rounded-3xl bg-destructive p-8 text-white md:p-12">
          <h1 className="text-3xl font-semibold md:text-5xl">In immediate danger?</h1>
          <p className="max-w-xl text-lg text-white/85">
            Call emergency services right away. Tap the button below to dial from your phone.
          </p>
          <a
            href="tel:911"
            className="inline-flex h-16 w-fit items-center gap-3 rounded-2xl bg-white px-8 font-heading text-2xl font-semibold text-destructive shadow-lg hover:bg-white/90"
          >
            <Phone className="size-7" aria-hidden="true" />
            Call 911
          </a>
        </div>

        <section aria-labelledby="hotlines-title">
          <h2 id="hotlines-title" className="mb-4 text-2xl font-semibold">
            Helplines
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {SERVICES.map(({ label, number, icon: Icon, note }) => (
              <li key={label}>
                <a
                  href={`tel:${number.replace(/[^\d]/g, "")}`}
                  className="flex items-center gap-4 rounded-2xl border bg-card p-5 transition-colors hover:border-primary"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-semibold">{label}</span>
                    <span className="font-heading text-xl font-semibold text-primary">{number}</span>
                    <span className="text-sm text-muted-foreground">{note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <MyEmergencyContacts />
      </main>
      <SiteFooter />
    </>
  )
}
