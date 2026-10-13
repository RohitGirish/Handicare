# 🤝 HandiCare — Accessibility & Community Support Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Everyday help, from people who care.**  
> HandiCare bridges the gap between individuals with disabilities and verified, compassionate local volunteers — enabling quick requests for rides, grocery delivery, medical appointments, household tasks, and companionship.

---

## ✨ Features

### 👤 Role-Based Portals
- **Requester (User)**:
  - Submit help requests specifying task category, date, time, duration, location, and urgency.
  - Track active requests across lifecycle states (`pending`, `accepted`, `in_progress`, `completed`).
  - Manage personal emergency contacts with 1-click calling.
  - Rate and leave feedback for volunteers upon completion.
- **Volunteer**:
  - Discover nearby community requests in real-time.
  - Accept tasks based on availability and skillset.
  - Track completed contributions, impact metrics, and rating statistics.
- **Administrator**:
  - Comprehensive dashboard monitoring system metrics (total users, active volunteers, request throughput).
  - Manage user and volunteer directory with detailed profile inspection.
  - Oversee platform health and resolve support escalations.

### 🚨 Emergency Assistance
- Dedicated Emergency Contacts hub (`/emergency` & `/dashboard/contacts`) for rapid reach out during urgent situations.
- Urgent priority flags on requests for immediate notification.

### 🌟 Ratings & Testimonials
- Star rating system and public/private feedback to maintain trust, safety, and service excellence across the community.

### 🎨 Modern & Accessible UI
- Fully responsive interface built with Tailwind CSS and Radix/Base UI components.
- Accessible heading hierarchy, ARIA tags, color-contrast compliance, and dark/light mode foundations.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- **Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) + PostCSS
- **Components**: [shadcn/ui](https://ui.shadcn.com) primitives + Base UI
- **Icons**: [Lucide React](https://lucide.dev)
- **State & Data**: [SWR](https://swr.vercel.app/) + Client-side session management
- **Language**: [TypeScript](https://www.typescriptlang.org/)

---

## 📁 Project Structure

```text
frontend-ui-design/
├── app/                      # Next.js App Router pages and layouts
│   ├── admin/                # Administrator management portal
│   ├── dashboard/            # Requester dashboard & request management
│   │   ├── contacts/         # Emergency contacts view
│   │   ├── feedback/         # Feedback submission & history
│   │   ├── new-request/      # New assistance request form
│   │   └── requests/         # Active & past requests list
│   ├── emergency/            # Quick emergency contacts directory
│   ├── feedback/             # Public community feedback
│   ├── login/                # Authentication / Login
│   ├── register/             # Role-based onboarding (User / Volunteer)
│   ├── volunteer/            # Volunteer discovery & task dashboard
│   ├── globals.css           # Global Tailwind CSS definitions
│   └── page.tsx              # Landing page
├── components/               # Modular UI components
│   ├── admin/                # Admin tables and metrics
│   ├── auth/                 # Login, register, and role selectors
│   ├── dashboard/            # Request cards and shell layouts
│   ├── emergency/            # Emergency contact cards
│   ├── landing/              # Hero, services, testimonials, CTA
│   └── ui/                   # Reusable atomic UI elements (buttons, dialogs, etc.)
├── hooks/                    # Custom React hooks (useSession, etc.)
├── lib/                      # Utilities, demo mock data, types, and labels
└── public/                   # Static assets, logos, and illustrations
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.18.0 or higher recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RohitGirish/Handicare.git
   cd Handicare
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Credentials & Quick Switch

HandiCare includes interactive demo presets to quickly test each role without configuring an external backend:
- **Requester**: Sign in as a regular user needing assistance.
- **Volunteer**: Sign in as a registered volunteer to accept requests.
- **Admin**: Sign in with administrator privileges to inspect system tables.

Use the role-switching quick bar or pre-filled login prompts on `/login`.

---

## 📄 License

This project is licensed under the MIT License.
