import { db } from "@/lib/db"
import { ContainerForm } from "@/components/containers/container-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function NewContainerPage() {
  const orders = await db.order.findMany({
    orderBy: { orderNumber: "asc" },
    select: { id: true, orderNumber: true },
  })

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Container" description="Register a new shipping container." />
      <div className="rounded-lg border border-border bg-card p-6">
        <ContainerForm apiPath="/api/containers" orders={orders} />
      </div>
    </div>
  )
}
