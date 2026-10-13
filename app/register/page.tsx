import type { Metadata } from "next"
import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"
import type { Role } from "@/lib/types"

export const metadata: Metadata = { title: "Create an account" }

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams
  const initialRole: Role = role === "volunteer" || role === "admin" ? role : "user"
  return (
    <AuthShell title="Join HandiCare" subtitle="It's free, and takes about two minutes.">
      <RegisterForm initialRole={initialRole} />
    </AuthShell>
  )
}
