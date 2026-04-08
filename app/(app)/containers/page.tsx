import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DeleteContainerButton } from "@/components/containers/delete-container-button"
import { CONTAINER_TYPE_LABELS } from "@/components/shared/status-badge"

type ContainerRow = Awaited<ReturnType<typeof getContainers>>[number]

async function getContainers() {
  return db.container.findMany({
    include: { order: { select: { id: true, orderNumber: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export default async function ContainersPage() {
  const containers = await getContainers()

  const columns: Column<ContainerRow>[] = [
    {
      key: "number",
      header: "Container #",
      render: (c) => <span className="font-mono font-medium">{c.containerNumber}</span>,
    },
    { key: "type", header: "Type", render: (c) => CONTAINER_TYPE_LABELS[c.type] ?? c.type },
    { key: "status", header: "Status", render: (c) => <StatusBadge status={c.status} /> },
    {
      key: "order",
      header: "Order",
      render: (c) =>
        c.order ? (
          <Link href={`/orders/${c.order.id}`} className="hover:underline text-sm">
            {c.order.orderNumber}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/containers/${c.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteContainerButton id={c.id} number={c.containerNumber} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Containers"
        description={`${containers.length} total`}
        action={
          <Button asChild size="sm">
            <Link href="/containers/new">
              <Plus className="mr-1 h-4 w-4" /> New Container
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={containers} emptyMessage="No containers yet." />
    </div>
  )
}
