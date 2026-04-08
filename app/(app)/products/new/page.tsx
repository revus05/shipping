import { db } from "@/lib/db"
import { ProductForm } from "@/components/products/product-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function NewProductPage() {
  const suppliers = await db.supplier.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } })

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Product" description="Add a new product to the catalog." />
      <div className="rounded-lg border border-border bg-card p-6">
        <ProductForm apiPath="/api/products" suppliers={suppliers} />
      </div>
    </div>
  )
}
