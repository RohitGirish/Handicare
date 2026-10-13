"use client"

import { HandHeart, ShieldCheck, User } from "lucide-react"
import type { Role } from "@/lib/types"
import { cn } from "@/lib/utils"

const ROLES: { value: Role; label: string; icon: typeof User }[] = [
  { value: "user", label: "I need help", icon: User },
  { value: "volunteer", label: "Volunteer", icon: HandHeart },
  { value: "admin", label: "Admin", icon: ShieldCheck },
]

export function RolePicker({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-base font-medium">I am signing in as</legend>
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map(({ value: v, label, icon: Icon }) => (
          <label
            key={v}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 bg-card p-3 text-center text-sm font-semibold transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
              value === v ? "border-primary bg-secondary text-secondary-foreground" : "border-border hover:border-primary/40",
            )}
          >
            <input
              type="radio"
              name="role"
              value={v}
              checked={value === v}
              onChange={() => onChange(v)}
              className="sr-only"
            />
            <Icon className="size-6" aria-hidden="true" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
