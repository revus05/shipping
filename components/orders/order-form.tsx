"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { orderSchema, type OrderFormValues } from "@/lib/validations/order"

interface OrderFormProps {
  defaultValues?: Partial<OrderFormValues>
  apiPath: string
  method?: "POST" | "PUT"
  customers: Array<{ id: string; name: string }>
  suppliers: Array<{ id: string; name: string }>
  products: Array<{ id: string; name: string; sku: string; unitPrice: number; currency: string; unit: string }>
}

const ORDER_STATUSES = ["DRAFT", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const

export function OrderForm({
  defaultValues = {},
  apiPath,
  method = "POST",
  customers,
  suppliers,
  products,
}: OrderFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      status: "DRAFT",
      items: [{ productId: "", quantity: 1, unitPrice: 0, currency: "USD" }],
      ...defaultValues,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchedItems = form.watch("items")
  const total = watchedItems.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0
    const price = Number(item.unitPrice) || 0
    return sum + qty * price
  }, 0)

  function onProductSelect(index: number, productId: string) {
    const product = products.find((p) => p.id === productId)
    if (product) {
      form.setValue(`items.${index}.unitPrice`, product.unitPrice)
      form.setValue(`items.${index}.currency`, product.currency)
    }
  }

  async function onSubmit(values: OrderFormValues) {
    setIsLoading(true)
    try {
      const res = await fetch(apiPath, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error ?? "Failed to save order")
        return
      }
      toast.success("Order saved")
      router.push("/orders")
      router.refresh()
    } catch {
      toast.error("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Header fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <FormField
            control={form.control}
            name="orderNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Number *</FormLabel>
                <FormControl>
                  <Input placeholder="ORD-2024-001" {...field} />
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
                    {ORDER_STATUSES.map((s) => (
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
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
            name="supplierId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes..." rows={2} {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Line items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Order Items</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productId: "", quantity: 1, unitPrice: 0, currency: "USD" })}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
            </Button>
          </div>

          {form.formState.errors.items?.root && (
            <p className="text-sm text-destructive mb-2">{form.formState.errors.items.root.message}</p>
          )}
          {typeof form.formState.errors.items?.message === "string" && (
            <p className="text-sm text-destructive mb-2">{form.formState.errors.items.message}</p>
          )}

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-start p-3 rounded-md border border-border bg-muted/30"
              >
                {/* Product */}
                <div className="col-span-12 sm:col-span-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Product *</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            f.onChange(val)
                            onProductSelect(index, val)
                          }}
                          defaultValue={f.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.name} ({p.sku})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Quantity */}
                <div className="col-span-4 sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Qty *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.0001" min="0" className="h-8 text-xs" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-4 sm:col-span-3">
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Unit Price *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.0001" min="0" className="h-8 text-xs" {...f} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Currency */}
                <div className="col-span-3 sm:col-span-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.currency`}
                    render={({ field: f }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Currency</FormLabel>
                        <Select onValueChange={f.onChange} defaultValue={f.value}>
                          <FormControl>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="CNY">CNY</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subtotal + Remove */}
                <div className="col-span-1 sm:col-span-1 flex flex-col items-end justify-end gap-1 pt-5">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-4 flex justify-end">
            <div className="rounded-md border border-border px-4 py-2 text-sm">
              <span className="text-muted-foreground mr-3">Total:</span>
              <span className="font-mono font-semibold">{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Order
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
