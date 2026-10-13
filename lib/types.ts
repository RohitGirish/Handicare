export type Role = "user" | "volunteer" | "admin"

export type RequestStatus = "pending" | "accepted" | "in_progress" | "completed" | "cancelled"

export type RequestType = "shopping" | "medical" | "housework" | "transportation" | "companionship" | "other"

export interface SessionUser {
  name: string
  email: string
  role: Role
}

export interface HelpRequest {
  id: number
  title: string
  type: RequestType
  date: string
  time: string
  duration: number
  location: string
  description: string
  is_urgent: boolean | number
  status: RequestStatus
  created_at: string
  volunteer_id?: number | null
  volunteer_name?: string | null
  user_name?: string | null
  requester?: {
    name: string
    phone?: string
    email?: string
    address?: string
    disability?: string | null
    completedRequests?: number
  }
}

export interface EmergencyContact {
  id: number
  name: string
  relationship: string
  phone: string
  email?: string | null
}

export interface Feedback {
  id: number
  volunteer_id: number
  volunteer_name?: string
  user_name?: string
  rating: number
  comment: string
  is_public?: boolean | number
  created_at: string
}

export interface VolunteerSummary {
  id: number
  name: string
  email: string
  phone: string
  stats: { completedTasks: number; averageRating: string }
}

export interface AdminPerson {
  id: number
  name: string
  email: string
  phone: string
  address: string
  disability?: string | null
  skills?: string | null
  availability?: string | null
  created_at: string
}

export interface AdminStats {
  userCount: number
  volunteerCount: number
  requestCount: number
  completedCount: number
}

export interface RegisterInput {
  role: Role
  name: string
  email: string
  phone: string
  password: string
  address: string
  disability?: string
  skills?: string
  availability?: string
  admin_secret?: string
}

export interface NewHelpRequest {
  title: string
  type: RequestType
  date: string
  time: string
  duration: number
  location: string
  description: string
  is_urgent: boolean
}

export interface NewContact {
  name: string
  relationship: string
  phone: string
  email?: string
}
