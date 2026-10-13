"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function StarRatingInput({
  value,
  onChange,
  name = "rating",
}: {
  value: number
  onChange: (v: number) => void
  name?: string
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-base font-medium">Your rating</legend>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer rounded-md p-1 has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50">
            <input
              type="radio"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange(n)}
              className="sr-only"
            />
            <span className="sr-only">
              {n} star{n > 1 ? "s" : ""}
            </span>
            <Star
              className={cn("size-8 transition-colors", n <= value ? "fill-warning text-warning" : "text-border")}
              aria-hidden="true"
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function StarDisplay({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn("size-4", n <= value ? "fill-warning text-warning" : "text-border")}
          aria-hidden="true"
        />
      ))}
    </span>
  )
}
