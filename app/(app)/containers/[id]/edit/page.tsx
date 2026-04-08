import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ContainerForm } from "@/components/containers/container-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditContainerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [container, orders] = await Promise.all([
    db.container.findUnique({ where: { id } }),
    db.order.findMany({ orderBy: { orderNumber: "asc" }, select: { id: true, orderNumber: true } }),
  ])
  if (!container) notFound()

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit Container" description={container.containerNumber} />
      <div className="rounded-lg border border-border bg-card p-6">
        <ContainerForm
          defaultValues={{
            containerNumber: container.containerNumber,
            type: container.type as "TWENTY_FT" | "FORTY_FT" | "FORTY_HC",
            status: container.status as "AVAILABLE" | "ASSIGNED" | "IN_TRANSIT" | "DELIVERED",
            orderId: container.orderId,
          }}
          apiPath={`/api/containers/${id}`}
          method="PUT"
          orders={orders}
        />
      </div>
    </div>
  )
}
