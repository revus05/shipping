import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProductForm } from "@/components/products/product-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, suppliers] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.supplier.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ])
  if (!product) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Product" description={product.name} />
      <div className="rounded-lg border border-border bg-card p-6">
        <ProductForm
          defaultValues={{
            name: product.name,
            sku: product.sku,
            description: product.description ?? "",
            unit: product.unit,
            unitPrice: Number(product.unitPrice),
            currency: product.currency,
            supplierId: product.supplierId,
          }}
          apiPath={`/api/products/${id}`}
          method="PUT"
          suppliers={suppliers}
        />
      </div>
    </div>
  )
}
