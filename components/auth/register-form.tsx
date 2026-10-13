"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { RolePicker } from "@/components/auth/role-picker"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { register } from "@/lib/api"
import type { Role } from "@/lib/types"

export function RegisterForm({ initialRole }: { initialRole: Role }) {
  const router = useRouter()
  const [role, setRole] = useState<Role>(initialRole)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? "").trim()

    if (get("password").length < 8) return setError("Password must be at least 8 characters.")
    if (get("password") !== get("confirm_password")) return setError("Passwords do not match.")

    setPending(true)
    setError(null)
    try {
      await register({
        role,
        name: get("name"),
        email: get("email"),
        phone: get("phone"),
        password: get("password"),
        address: get("address"),
        disability: role === "user" ? get("disability") : undefined,
        skills: role === "volunteer" ? get("skills") : undefined,
        availability: role === "volunteer" ? get("availability") : undefined,
        admin_secret: role === "admin" ? get("admin_secret") : undefined,
      })
      toast.success("Account created! Please sign in.")
      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <RolePicker value={role} onChange={setRole} />

      <FormField label="Full name" name="name" autoComplete="name" required />
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Email address" name="email" type="email" autoComplete="email" required />
        <FormField label="Phone number" name="phone" type="tel" autoComplete="tel" required />
      </div>
      <FormField label="Address" name="address" autoComplete="street-address" required />

      {role === "user" && (
        <FormField
          label="Disability or support needs"
          name="disability"
          hint="This helps volunteers prepare. Share only what you're comfortable with."
          required
        />
      )}
      {role === "volunteer" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Skills" name="skills" placeholder="Driving, sign language…" />
          <FormField label="Availability" name="availability" placeholder="Weekends, evenings…" />
        </div>
      )}
      {role === "admin" && <FormField label="Admin secret code" name="admin_secret" type="password" required />}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters"
          required
        />
        <FormField
          label="Confirm password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="h-12 text-base">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
