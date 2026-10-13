import { demoAccounts, demoStore } from "./demo-data"
import type {
  AdminPerson,
  AdminStats,
  EmergencyContact,
  Feedback,
  HelpRequest,
  NewContact,
  NewHelpRequest,
  RegisterInput,
  RequestStatus,
  Role,
  SessionUser,
  VolunteerSummary,
} from "./types"

export const isDemoMode = !process.env.NEXT_PUBLIC_BACKEND_URL

const DEMO_SESSION_KEY = "handicare-demo-session"

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/backend${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.success === false) {
    throw new ApiError(data.message || data.error || "Something went wrong", res.status)
  }
  return data as T
}

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms))

function demoSession(): SessionUser | null {
  if (typeof window === "undefined") return null
  const role = window.sessionStorage.getItem(DEMO_SESSION_KEY) as Role | null
  return role ? demoAccounts[role] : null
}

/* ---------- Auth ---------- */

export async function getSession(): Promise<SessionUser | null> {
  if (isDemoMode) return demoSession()
  try {
    const data = await request<SessionUser & { success: boolean }>("/api/user/info")
    return { name: data.name, email: data.email, role: data.role }
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null
    throw e
  }
}

export async function login(email: string, password: string, role: Role): Promise<SessionUser> {
  if (isDemoMode) {
    await wait()
    if (!email || !password) throw new ApiError("Please enter your email and password", 400)
    window.sessionStorage.setItem(DEMO_SESSION_KEY, role)
    return demoAccounts[role]
  }
  const data = await request<{ user: SessionUser & { id: number } }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  })
  return { name: data.user.name, email: data.user.email, role: data.user.role }
}

export async function register(input: RegisterInput): Promise<void> {
  if (isDemoMode) {
    await wait()
    return
  }
  // The Express handler answers with redirects; an `error` query param signals failure.
  const res = await fetch("/backend/register", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const error = new URL(res.url, window.location.origin).searchParams.get("error")
  if (error) throw new ApiError(error, 400)
  if (!res.ok) throw new ApiError("Registration failed. Please try again.", res.status)
}

export async function logout(): Promise<void> {
  if (isDemoMode) {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY)
    return
  }
  await fetch("/backend/logout", { credentials: "include" })
}

/* ---------- Users ---------- */

export async function getMyRequests(): Promise<HelpRequest[]> {
  if (isDemoMode) {
    await wait(200)
    return demoStore.requests.filter((r) => r.user_name === "John Doe")
  }
  return (await request<{ requests: HelpRequest[] }>("/api/help_requests")).requests
}

export async function createRequest(input: NewHelpRequest): Promise<void> {
  if (isDemoMode) {
    await wait()
    demoStore.requests.unshift({
      ...input,
      id: demoStore.nextId++,
      time: `${input.time}:00`,
      status: "pending",
      created_at: new Date().toISOString(),
      volunteer_id: null,
      volunteer_name: null,
      user_name: "John Doe",
      requester: { name: "John Doe", disability: "Mobility impairment", completedRequests: 4 },
    })
    return
  }
  await request("/api/help_requests", { method: "POST", body: JSON.stringify(input) })
}

export async function updateMyRequestStatus(id: number, status: RequestStatus): Promise<void> {
  if (isDemoMode) {
    await wait()
    const r = demoStore.requests.find((x) => x.id === id)
    if (r) r.status = status
    return
  }
  await request(`/api/help_requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) })
}

export async function getContacts(): Promise<EmergencyContact[]> {
  if (isDemoMode) {
    await wait(200)
    return [...demoStore.contacts]
  }
  return (await request<{ contacts: EmergencyContact[] }>("/api/emergency_contacts")).contacts
}

export async function addContact(input: NewContact): Promise<void> {
  if (isDemoMode) {
    await wait()
    demoStore.contacts.push({ ...input, id: demoStore.nextId++ })
    return
  }
  await request("/api/emergency_contacts", { method: "POST", body: JSON.stringify(input) })
}

export async function deleteContact(id: number): Promise<void> {
  if (isDemoMode) {
    await wait()
    demoStore.contacts = demoStore.contacts.filter((c) => c.id !== id)
    return
  }
  await request(`/api/emergency_contacts/${id}`, { method: "DELETE" })
}

export async function getMyFeedback(): Promise<Feedback[]> {
  if (isDemoMode) {
    await wait(200)
    return demoStore.feedback.filter((f) => f.user_name === "John Doe")
  }
  return (await request<{ feedback: Feedback[] }>("/api/feedback")).feedback
}

export async function submitVolunteerFeedback(input: {
  volunteer_id: number
  rating: number
  comment: string
  is_public: boolean
}): Promise<void> {
  if (isDemoMode) {
    await wait()
    const v = demoStore.volunteers.find((x) => x.id === input.volunteer_id)
    demoStore.feedback.unshift({
      ...input,
      id: demoStore.nextId++,
      volunteer_name: v?.name,
      user_name: "John Doe",
      created_at: new Date().toISOString(),
    })
    return
  }
  await request("/api/feedback", { method: "POST", body: JSON.stringify(input) })
}

export async function getVolunteers(): Promise<VolunteerSummary[]> {
  if (isDemoMode) {
    await wait(200)
    return [...demoStore.volunteers]
  }
  return (await request<{ volunteers: VolunteerSummary[] }>("/api/volunteers")).volunteers
}

export async function submitGeneralFeedback(input: {
  name: string
  email: string
  feedback: string
  rating: number
}): Promise<void> {
  if (isDemoMode) {
    await wait()
    return
  }
  const res = await fetch("/backend/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (new URL(res.url, window.location.origin).searchParams.get("error_msg")) {
    throw new ApiError("Could not send feedback. Please try again.", 400)
  }
}

/* ---------- Volunteers ---------- */

export async function getAvailableRequests(): Promise<HelpRequest[]> {
  if (isDemoMode) {
    await wait(200)
    return demoStore.requests
      .filter((r) => r.status === "pending" && !r.volunteer_id)
      .sort((a, b) => Number(b.is_urgent) - Number(a.is_urgent))
  }
  return (await request<{ requests: HelpRequest[] }>("/api/volunteer/available-requests")).requests
}

export async function getAssignedRequests(): Promise<HelpRequest[]> {
  if (isDemoMode) {
    await wait(200)
    return demoStore.requests.filter((r) => r.volunteer_id === 1)
  }
  return (await request<{ requests: HelpRequest[] }>("/api/volunteer/assigned-requests")).requests
}

export async function acceptRequest(id: number): Promise<void> {
  if (isDemoMode) {
    await wait()
    const r = demoStore.requests.find((x) => x.id === id)
    if (r) Object.assign(r, { status: "accepted", volunteer_id: 1, volunteer_name: "Sarah Johnson" })
    return
  }
  await request(`/api/volunteer/accept-request/${id}`, { method: "POST" })
}

export async function updateAssignedStatus(id: number, status: RequestStatus): Promise<void> {
  if (isDemoMode) {
    await wait()
    const r = demoStore.requests.find((x) => x.id === id)
    if (r) r.status = status
    return
  }
  await request(`/api/volunteer/help-requests/${id}`, { method: "PUT", body: JSON.stringify({ status }) })
}

/* ---------- Admin ---------- */

export async function getAdminStats(period: string): Promise<AdminStats> {
  if (isDemoMode) {
    await wait(200)
    return {
      userCount: demoStore.users.length,
      volunteerCount: demoStore.adminVolunteers.length,
      requestCount: demoStore.requests.length,
      completedCount: demoStore.requests.filter((r) => r.status === "completed").length,
    }
  }
  return (await request<{ stats: AdminStats }>(`/api/admin/dashboard?period=${encodeURIComponent(period)}`)).stats
}

export async function getAdminUsers(): Promise<AdminPerson[]> {
  if (isDemoMode) return [...demoStore.users]
  return (await request<{ users: AdminPerson[] }>("/api/admin/users")).users
}

export async function getAdminVolunteers(): Promise<AdminPerson[]> {
  if (isDemoMode) return [...demoStore.adminVolunteers]
  return (await request<{ volunteers: AdminPerson[] }>("/api/admin/volunteers")).volunteers
}

export async function getAdminRequests(): Promise<HelpRequest[]> {
  if (isDemoMode) return [...demoStore.requests]
  return (await request<{ requests: HelpRequest[] }>("/api/admin/requests")).requests
}

export async function getAdminFeedback(): Promise<Feedback[]> {
  if (isDemoMode) return [...demoStore.feedback]
  return (await request<{ feedback: Feedback[] }>("/api/admin/feedback")).feedback
}

export async function adminDelete(kind: "users" | "volunteers" | "requests" | "feedback", id: number) {
  if (isDemoMode) {
    await wait()
    if (kind === "users") demoStore.users = demoStore.users.filter((x) => x.id !== id)
    if (kind === "volunteers") demoStore.adminVolunteers = demoStore.adminVolunteers.filter((x) => x.id !== id)
    if (kind === "requests") demoStore.requests = demoStore.requests.filter((x) => x.id !== id)
    if (kind === "feedback") demoStore.feedback = demoStore.feedback.filter((x) => x.id !== id)
    return
  }
  await request(`/api/admin/${kind}/${id}`, { method: "DELETE" })
}
