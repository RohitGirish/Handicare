import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Services } from "@/components/landing/services"
import { TestimonialsCta } from "@/components/landing/testimonials-cta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Services />
        <HowItWorks />
        <TestimonialsCta />
      </main>
      <SiteFooter />
    </>
  )
}
