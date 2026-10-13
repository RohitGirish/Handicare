const STEPS = [
  { title: "Create your account", body: "Sign up in a couple of minutes and tell us a bit about what support works best for you." },
  { title: "Post a request", body: "Choose the type of help, pick a date and time, and add any details a volunteer should know." },
  { title: "Get matched", body: "A verified volunteer nearby accepts your request and you'll see their details right away." },
  { title: "Rate your experience", body: "After each visit, leave feedback so our community stays kind, safe and reliable." },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-2 font-semibold text-primary">How it works</p>
          <h2 id="how-title" className="text-3xl font-semibold tracking-tight md:text-4xl">
            Four simple steps to getting help
          </h2>
        </div>
        <ol className="grid gap-8 md:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3">
              <span
                className="flex size-12 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
