import { Car, HeartPulse, Home, MessageCircleHeart, ShoppingBasket, Sparkles } from "lucide-react"

const SERVICES = [
  { icon: Car, title: "Transportation", body: "Safe rides to work, appointments, events and back home again." },
  { icon: ShoppingBasket, title: "Grocery shopping", body: "Pick-ups, carrying bags, or shopping alongside you." },
  { icon: HeartPulse, title: "Medical appointments", body: "Accompaniment to clinics, pharmacies and therapy sessions." },
  { icon: Home, title: "Housework", body: "Light cleaning, reaching high shelves, and small chores." },
  { icon: MessageCircleHeart, title: "Companionship", body: "A friendly visit, a walk in the park, or a good chat." },
  { icon: Sparkles, title: "Anything else", body: "Tech setup, paperwork, errands — just describe what you need." },
]

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="bg-card py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 font-semibold text-primary">What we help with</p>
          <h2 id="services-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Support that fits your day
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex flex-col gap-3 rounded-2xl border bg-background p-6">
              <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold">{title}</h3>
              <p className="leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
