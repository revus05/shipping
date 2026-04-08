"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntityForm } from "@/components/shared/entity-form"
import { commercialInvoiceSchema, type CommercialInvoiceFormValues } from "@/lib/validations/commercial-invoice"

interface CIFormProps {
  defaultValues?: Partial<CommercialInvoiceFormValues>
  apiPath: string
  method?: "POST" | "PUT"
  orders: Array<{ id: string; orderNumber: string }>
  proformaInvoices: Array<{ id: string; piNumber: string }>
}

export function CIForm({ defaultValues = {}, apiPath, method = "POST", orders, proformaInvoices }: CIFormProps) {
  return (
    <EntityForm
      schema={commercialInvoiceSchema}
      defaultValues={{ status: "DRAFT", ...defaultValues }}
      apiPath={apiPath}
      method={method}
      redirectPath="/invoices/commercial"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="ciNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CI Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="CI-2024-001" {...field} />
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
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="ISSUED">Issued</SelectItem>
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
            <FormField
              control={form.control}
              name="piId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proforma Invoice</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                    defaultValue={field.value ?? "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="— None —" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">— None —</SelectItem>
                      {proformaInvoices.map((pi) => (
                        <SelectItem key={pi.id} value={pi.id}>
                          {pi.piNumber}
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
            name="issuedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Date *</FormLabel>
                <FormControl>
                  <Input type="date" className="w-48" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Terms</FormLabel>
                  <FormControl>
                    <Input placeholder="T/T 30 days, L/C at sight" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="portOfLoading"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port of Loading</FormLabel>
                  <FormControl>
                    <Input placeholder="Shanghai, China" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="portOfDischarge"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port of Discharge</FormLabel>
                <FormControl>
                  <Input placeholder="Los Angeles, USA" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes / Remarks</FormLabel>
                <FormControl>
                  <Textarea placeholder="Incoterms, packing info, etc." rows={3} {...field} value={field.value ?? ""} />
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
