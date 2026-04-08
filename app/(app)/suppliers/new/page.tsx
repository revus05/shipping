import { SupplierForm } from "@/components/suppliers/supplier-form"
import { PageHeader } from "@/components/shared/page-header"

export default function NewSupplierPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="New Supplier" description="Add a new supplier to the system." />
      <div className="rounded-lg border border-border bg-card p-6">
        <SupplierForm apiPath="/api/suppliers" />
      </div>
    </div>
  )
}
