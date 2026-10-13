"use client"

import useSWR from "swr"
import { getSession } from "@/lib/api"
import type { Role } from "@/lib/types"

export function useSession() {
  const { data, isLoading, mutate } = useSWR("session", getSession)
  return { user: data ?? null, isLoading, mutate }
}

export function dashboardPath(role: Role) {
  if (role === "volunteer") return "/volunteer"
  if (role === "admin") return "/admin"
  return "/dashboard"
}
