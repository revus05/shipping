import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { DeleteCustomerButton } from "@/components/customers/delete-customer-button"

type CustomerRow = Awaited<ReturnType<typeof db.customer.findMany>>[number]

export default async function CustomersPage() {
  const customers = await db.customer.findMany({ orderBy: { name: "asc" } })

  const columns: Column<CustomerRow>[] = [
    { key: "name", header: "Name", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "country", header: "Country", render: (c) => c.country ?? "—" },
    { key: "contact", header: "Contact", render: (c) => c.contact ?? "—" },
    { key: "email", header: "Email", render: (c) => c.email ?? "—" },
    { key: "phone", header: "Phone", render: (c) => c.phone ?? "—" },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/customers/${c.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteCustomerButton id={c.id} name={c.name} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/customers/new">
              <Plus className="mr-1 h-4 w-4" /> New Customer
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={customers} emptyMessage="No customers yet." />
    </div>
  )
}
