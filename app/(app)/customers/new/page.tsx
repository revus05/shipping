import { CustomerForm } from "@/components/customers/customer-form"
import { PageHeader } from "@/components/shared/page-header"

export default function NewCustomerPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="New Customer" description="Add a new customer to the system." />
      <div className="rounded-lg border border-border bg-card p-6">
        <CustomerForm apiPath="/api/customers" />
      </div>
    </div>
  )
}
