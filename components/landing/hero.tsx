import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Star } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:px-6 md:py-24">
        <div className="flex flex-col gap-6">
          <p className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-foreground">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Verified local volunteers
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-tight md:text-6xl">
            Everyday help, from people who care.
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
            HandiCare connects people with disabilities to trusted volunteers nearby — for rides, groceries, appointments,
            housework or simply some good company.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/register" className={cn(buttonVariants(), "h-12 px-6 text-base")}>
              I need help
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link
              href="/register?role=volunteer"
              className={cn(buttonVariants({ variant: "outline" }), "h-12 px-6 text-base")}
            >
              I want to volunteer
            </Link>
          </div>
          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 border-t pt-6">
            <div>
              <dt className="text-sm text-muted-foreground">Volunteers</dt>
              <dd className="font-heading text-2xl font-semibold">1,200+</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Requests met</dt>
              <dd className="font-heading text-2xl font-semibold">8,400</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Avg. rating</dt>
              <dd className="flex items-center gap-1 font-heading text-2xl font-semibold">
                4.9
                <Star className="size-5 fill-warning text-warning" aria-hidden="true" />
              </dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted md:aspect-[4/5]">
            <Image
              src="/images/hero.png"
              alt="A volunteer smiling while helping a woman in a wheelchair in a sunny park"
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-lg md:-left-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-success/15 text-success">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold">Request accepted</p>
              <p className="text-sm text-muted-foreground">Sarah will arrive at 10:30 AM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
