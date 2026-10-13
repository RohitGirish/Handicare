"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { RolePicker } from "@/components/auth/role-picker"
import { FormField } from "@/components/form-field"
import { Button } from "@/components/ui/button"
import { dashboardPath, useSession } from "@/hooks/use-session"
import { isDemoMode, login } from "@/lib/api"
import type { Role } from "@/lib/types"

export function LoginForm() {
  const router = useRouter()
  const { mutate } = useSession()
  const [role, setRole] = useState<Role>("user")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    setError(null)
    try {
      const user = await login(String(form.get("email")), String(form.get("password")), role)
      await mutate(user, { revalidate: false })
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`)
      router.push(dashboardPath(user.role))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed")
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate={isDemoMode}>
      <RolePicker value={role} onChange={setRole} />
      <FormField
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={isDemoMode ? "demo@handicare.org" : undefined}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        defaultValue={isDemoMode ? "demo1234" : undefined}
      />

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="h-12 text-base">
        {pending && <Loader2 className="animate-spin" aria-hidden="true" />}
        {pending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-muted-foreground">
        New to HandiCare?{" "}
        <Link href="/register" className="font-semibold text-primary underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  )
}
