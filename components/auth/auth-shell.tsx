import { HeartHandshake } from "lucide-react"
import { Logo } from "@/components/logo"
import { DemoBanner } from "@/components/demo-banner"

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <aside className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Logo inverted />
        <div className="max-w-md">
          <HeartHandshake className="mb-6 size-12 text-primary-foreground/70" aria-hidden="true" />
          <p className="font-heading text-3xl leading-snug font-medium">
            &ldquo;Independence isn&apos;t about doing everything alone. It&apos;s about having the right support when you
            need it.&rdquo;
          </p>
        </div>
        <p className="text-primary-foreground/70">Trusted by thousands of members and volunteers.</p>
      </aside>

      <main id="main" className="flex flex-col px-4 py-8 md:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 py-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-lg text-muted-foreground">{subtitle}</p>
          </div>
          <DemoBanner />
          {children}
        </div>
      </main>
    </div>
  )
}
