"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntityForm } from "@/components/shared/entity-form"
import { containerSchema, type ContainerFormValues } from "@/lib/validations/container"

interface ContainerFormProps {
  defaultValues?: Partial<ContainerFormValues>
  apiPath: string
  method?: "POST" | "PUT"
  orders?: Array<{ id: string; orderNumber: string }>
}

const CONTAINER_TYPES = [
  { value: "TWENTY_FT", label: "20FT" },
  { value: "FORTY_FT", label: "40FT" },
  { value: "FORTY_HC", label: "40HC" },
]

const CONTAINER_STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_TRANSIT", label: "In Transit" },
  { value: "DELIVERED", label: "Delivered" },
]

export function ContainerForm({
  defaultValues = {},
  apiPath,
  method = "POST",
  orders = [],
}: ContainerFormProps) {
  return (
    <EntityForm
      schema={containerSchema}
      defaultValues={{ status: "AVAILABLE", ...defaultValues }}
      apiPath={apiPath}
      method={method}
      redirectPath="/containers"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="containerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Container Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="MSCU1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTAINER_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTAINER_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Order</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                    defaultValue={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="— Not assigned —" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">— Not assigned —</SelectItem>
                      {orders.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.orderNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </EntityForm>
  )
}
