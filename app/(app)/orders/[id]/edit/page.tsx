import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { OrderForm } from "@/components/orders/order-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [order, customers, suppliers, products] = await Promise.all([
    db.order.findUnique({
      where: { id },
      include: { items: true },
    }),
    db.customer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.supplier.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true, unitPrice: true, currency: true, unit: true },
    }),
  ])

  if (!order) notFound()

  return (
    <div className="max-w-4xl">
      <PageHeader title="Edit Order" description={order.orderNumber} />
      <div className="rounded-lg border border-border bg-card p-6">
        <OrderForm
          defaultValues={{
            orderNumber: order.orderNumber,
            customerId: order.customerId,
            supplierId: order.supplierId,
            status: order.status as "DRAFT" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED",
            notes: order.notes ?? "",
            items: order.items.map((i: (typeof order.items)[number]) => ({
              productId: i.productId,
              quantity: Number(i.quantity),
              unitPrice: Number(i.unitPrice),
              currency: i.currency ?? "USD",
            })),
          }}
          apiPath={`/api/orders/${id}`}
          method="PUT"
          customers={customers}
          suppliers={suppliers}
          products={products.map((p: (typeof products)[number]) => ({ ...p, unitPrice: Number(p.unitPrice) }))}
        />
      </div>
    </div>
  )
}
