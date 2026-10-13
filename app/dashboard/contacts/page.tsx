"use client"

import { useState } from "react"
import useSWR from "swr"
import { Loader2, Mail, Phone, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { EmptyState, ListSkeleton, PageHeader } from "@/components/dashboard/dashboard-shell"
import { FormField } from "@/components/form-field"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { addContact, deleteContact, getContacts } from "@/lib/api"
import { initials } from "@/lib/labels"

export default function ContactsPage() {
  const { data, isLoading, mutate } = useSWR("contacts", getContacts)
  const [pending, setPending] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setPending(true)
    try {
      await addContact({
        name: String(f.get("name")).trim(),
        relationship: String(f.get("relationship")).trim(),
        phone: String(f.get("phone")).trim(),
        email: String(f.get("email") ?? "").trim() || undefined,
      })
      await mutate()
      form.reset()
      toast.success("Contact added")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add contact")
    } finally {
      setPending(false)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      await deleteContact(id)
      await mutate()
      toast.success("Contact removed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove contact")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Emergency contacts"
        description="People we can reach quickly if something goes wrong during a visit."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section aria-label="Saved contacts">
          {isLoading ? (
            <ListSkeleton rows={2} />
          ) : !data?.length ? (
            <EmptyState icon={Phone} title="No contacts yet" body="Add a family member, friend or carer using the form." />
          ) : (
            <ul className="flex flex-col gap-3">
              {data.map((c) => (
                <li key={c.id} className="flex items-center gap-4 rounded-2xl border bg-card p-5">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-secondary font-semibold text-secondary-foreground">
                      {initials(c.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold">{c.name}</p>
                    <p className="text-muted-foreground">{c.relationship}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-primary hover:underline">
                        <Phone className="size-4" aria-hidden="true" />
                        {c.phone}
                      </a>
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-primary hover:underline">
                          <Mail className="size-4" aria-hidden="true" />
                          {c.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-10 text-muted-foreground hover:text-destructive"
                    disabled={deletingId === c.id}
                    onClick={() => handleDelete(c.id)}
                    aria-label={`Remove ${c.name}`}
                  >
                    <Trash2 className="size-5" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <form
          onSubmit={handleAdd}
          className="flex h-fit flex-col gap-4 rounded-2xl border bg-card p-5"
          aria-labelledby="add-contact-title"
        >
          <h2 id="add-contact-title" className="flex items-center gap-2 text-xl font-semibold">
            <UserPlus className="size-5 text-primary" aria-hidden="true" />
            Add a contact
          </h2>
          <FormField label="Name" name="name" required />
          <FormField label="Relationship" name="relationship" placeholder="Daughter, carer…" required />
          <FormField label="Phone" name="phone" type="tel" required />
          <FormField label="Email" name="email" type="email" />
          <Button type="submit" disabled={pending} className="h-12 text-base">
            {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
            Save contact
          </Button>
        </form>
      </div>
    </>
  )
}
