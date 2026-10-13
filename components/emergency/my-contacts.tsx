"use client"

import Link from "next/link"
import useSWR from "swr"
import { Phone } from "lucide-react"
import { useSession } from "@/hooks/use-session"
import { getContacts } from "@/lib/api"

export function MyEmergencyContacts() {
  const { user } = useSession()
  const isMember = user?.role === "user"
  const { data } = useSWR(isMember ? "contacts" : null, getContacts)

  if (!isMember) return null

  return (
    <section aria-labelledby="my-contacts-title">
      <div className="mb-4 flex items-center justify-between">
        <h2 id="my-contacts-title" className="text-2xl font-semibold">
          Your emergency contacts
        </h2>
        <Link href="/dashboard/contacts" className="font-semibold text-primary underline-offset-4 hover:underline">
          Manage
        </Link>
      </div>
      {!data?.length ? (
        <p className="text-muted-foreground">You haven&apos;t added any contacts yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {data.map((c) => (
            <li key={c.id}>
              <a
                href={`tel:${c.phone}`}
                className="flex items-center justify-between gap-4 rounded-2xl border bg-card p-5 hover:border-primary"
              >
                <span>
                  <span className="block font-semibold">{c.name}</span>
                  <span className="text-muted-foreground">
                    {c.relationship} · {c.phone}
                  </span>
                </span>
                <span className="flex size-12 items-center justify-center rounded-full bg-success text-success-foreground">
                  <Phone className="size-5" aria-hidden="true" />
                  <span className="sr-only">Call {c.name}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
