"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"

export function DeletePIButton({ id, piNumber }: { id: string; piNumber: string }) {
  const router = useRouter()

  async function handleDelete() {
    const res = await fetch(`/api/invoices/proforma/${id}`, { method: "DELETE" })
    if (!res.ok) {
      toast.error("Failed to delete PI")
      return
    }
    toast.success("Proforma Invoice deleted")
    router.refresh()
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
      title="Delete Proforma Invoice"
      description={`Delete "${piNumber}"? This cannot be undone.`}
      onConfirm={handleDelete}
    />
  )
}
