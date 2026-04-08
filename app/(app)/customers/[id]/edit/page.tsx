import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { CustomerForm } from "@/components/customers/customer-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const customer = await db.customer.findUnique({ where: { id } })
  if (!customer) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Customer" description={customer.name} />
      <div className="rounded-lg border border-border bg-card p-6">
        <CustomerForm
          defaultValues={{
            name: customer.name,
            address: customer.address ?? "",
            contact: customer.contact ?? "",
            email: customer.email ?? "",
            phone: customer.phone ?? "",
            country: customer.country ?? "",
          }}
          apiPath={`/api/customers/${id}`}
          method="PUT"
        />
      </div>
    </div>
  )
}
