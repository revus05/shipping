import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { SupplierForm } from "@/components/suppliers/supplier-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supplier = await db.supplier.findUnique({ where: { id } })
  if (!supplier) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Supplier" description={supplier.name} />
      <div className="rounded-lg border border-border bg-card p-6">
        <SupplierForm
          defaultValues={{
            name: supplier.name,
            address: supplier.address ?? "",
            contact: supplier.contact ?? "",
            email: supplier.email ?? "",
            phone: supplier.phone ?? "",
            country: supplier.country ?? "",
          }}
          apiPath={`/api/suppliers/${id}`}
          method="PUT"
        />
      </div>
    </div>
  )
}
