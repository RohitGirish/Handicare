import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type FieldProps = React.ComponentProps<"input"> & {
  label: string
  hint?: string
  name: string
}

export const fieldClass = "h-12 rounded-lg bg-card px-3 text-base md:text-base"

export function FormField({ label, hint, name, id, className, required, ...props }: FieldProps) {
  const fieldId = id ?? name
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={fieldId} className="text-base">
        {label}
        {!required && <span className="font-normal text-muted-foreground"> (optional)</span>}
      </Label>
      <Input
        id={fieldId}
        name={name}
        required={required}
        aria-describedby={hint ? `${fieldId}-hint` : undefined}
        className={cn(fieldClass, className)}
        {...props}
      />
      {hint && (
        <p id={`${fieldId}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
    </div>
  )
}

export const selectClass =
  "h-12 w-full rounded-lg border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
