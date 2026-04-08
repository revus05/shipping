import { db } from "@/lib/db"
import { OrderForm } from "@/components/orders/order-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function NewOrderPage() {
  const [customers, suppliers, products] = await Promise.all([
    db.customer.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.supplier.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    db.product.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, sku: true, unitPrice: true, currency: true, unit: true },
    }),
  ])

  return (
    <div className="max-w-4xl">
      <PageHeader title="New Order" description="Create a new purchase order." />
      <div className="rounded-lg border border-border bg-card p-6">
        <OrderForm
          apiPath="/api/orders"
          customers={customers}
          suppliers={suppliers}
          products={products.map((p: (typeof products)[number]) => ({ ...p, unitPrice: Number(p.unitPrice) }))}
        />
      </div>
    </div>
  )
}
