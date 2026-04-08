"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntityForm } from "@/components/shared/entity-form"
import { proformaInvoiceSchema, type ProformaInvoiceFormValues } from "@/lib/validations/proforma-invoice"

interface PIFormProps {
  defaultValues?: Partial<ProformaInvoiceFormValues>
  apiPath: string
  method?: "POST" | "PUT"
  orders: Array<{ id: string; orderNumber: string }>
}

const PI_STATUSES = ["DRAFT", "SENT", "ACCEPTED", "REJECTED"] as const

export function PIForm({ defaultValues = {}, apiPath, method = "POST", orders }: PIFormProps) {
  return (
    <EntityForm
      schema={proformaInvoiceSchema}
      defaultValues={{ status: "DRAFT", ...defaultValues }}
      apiPath={apiPath}
      method={method}
      redirectPath="/invoices/proforma"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="piNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PI Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="PI-2024-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      {PI_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0) + s.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="orderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="issuedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Payment terms, conditions..." rows={3} {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </EntityForm>
  )
}
