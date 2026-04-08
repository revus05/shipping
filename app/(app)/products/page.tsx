import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { DeleteProductButton } from "@/components/products/delete-product-button"

type ProductWithSupplier = Awaited<ReturnType<typeof db.product.findMany>>[number] & {
  supplier: { id: string; name: string }
}

export default async function ProductsPage() {
  const products = await db.product.findMany({
    include: { supplier: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  })

  const columns: Column<(typeof products)[number]>[] = [
    { key: "name", header: "Name", render: (p) => <span className="font-medium">{p.name}</span> },
    { key: "sku", header: "SKU", render: (p) => <code className="text-xs">{p.sku}</code> },
    { key: "supplier", header: "Supplier", render: (p) => p.supplier.name },
    { key: "unit", header: "Unit", render: (p) => p.unit },
    {
      key: "price",
      header: "Price",
      render: (p) => (
        <span className="font-mono">
          {Number(p.unitPrice).toFixed(2)} {p.currency}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/products/${p.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteProductButton id={p.id} name={p.name} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${products.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/products/new">
              <Plus className="mr-1 h-4 w-4" /> New Product
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={products} emptyMessage="No products yet." />
    </div>
  )
}
