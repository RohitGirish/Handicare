import type { Metadata } from "next"
import { GeneralFeedbackForm } from "@/components/general-feedback-form"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Share feedback" }

export default function PublicFeedbackPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 md:px-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Tell us how we&apos;re doing</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Ideas, compliments or concerns — every message helps us improve.
          </p>
        </div>
        <GeneralFeedbackForm />
      </main>
      <SiteFooter />
    </>
  )
}
