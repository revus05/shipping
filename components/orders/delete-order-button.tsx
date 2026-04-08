"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"

export function DeleteOrderButton({ id, orderNumber }: { id: string; orderNumber: string }) {
  const router = useRouter()

  async function handleDelete() {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Failed to delete order")
      return
    }
    toast.success("Order deleted")
    router.refresh()
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title="Delete Order"
      description={`Are you sure you want to delete order "${orderNumber}"?`}
      onConfirm={handleDelete}
    />
  )
}
