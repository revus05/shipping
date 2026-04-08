"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  useForm,
  type FieldValues,
  type DefaultValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ZodType } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

interface EntityFormProps<T extends FieldValues> {
  schema: ZodType<T>
  defaultValues: DefaultValues<T>
  apiPath: string
  method?: "POST" | "PUT"
  redirectPath: string
  children: (form: UseFormReturn<T>) => React.ReactNode
  submitLabel?: string
}

export function EntityForm<T extends FieldValues>({
  schema,
  defaultValues,
  apiPath,
  method = "POST",
  redirectPath,
  children,
  submitLabel = "Save",
}: EntityFormProps<T>) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<T>({
    // biome-ignore lint/suspicious/noExplicitAny: zod resolver generic cast
    // biome-ignore lint/suspicious/noExplicitAny: zod v3/v4 resolver cast
    resolver: zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]) as unknown as Resolver<T, any>,
    defaultValues,
  })

  async function onSubmit(values: T) {
    setIsLoading(true)
    try {
      const res = await fetch(apiPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        toast.error(data.error ?? "Something went wrong")
        return
      }

      toast.success("Saved successfully")
      router.push(redirectPath)
      router.refresh()
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      {/* biome-ignore lint/suspicious/noExplicitAny: generic form submit */}
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4">
        {children(form)}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
