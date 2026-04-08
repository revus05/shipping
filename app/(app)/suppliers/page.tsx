import Link from "next/link"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { DeleteSupplierButton } from "@/components/suppliers/delete-supplier-button"

type SupplierRow = Awaited<ReturnType<typeof db.supplier.findMany>>[number]

export default async function SuppliersPage() {
  const suppliers = await db.supplier.findMany({ orderBy: { name: "asc" } })

  const columns: Column<SupplierRow>[] = [
    { key: "name", header: "Name", render: (s) => <span className="font-medium">{s.name}</span> },
    { key: "country", header: "Country", render: (s) => s.country ?? "—" },
    { key: "contact", header: "Contact", render: (s) => s.contact ?? "—" },
    { key: "email", header: "Email", render: (s) => s.email ?? "—" },
    { key: "phone", header: "Phone", render: (s) => s.phone ?? "—" },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/suppliers/${s.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteSupplierButton id={s.id} name={s.name} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description={`${suppliers.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/suppliers/new">
              <Plus className="mr-1 h-4 w-4" /> New Supplier
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={suppliers} emptyMessage="No suppliers yet." />
    </div>
  )
}
