import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  // Order statuses
  DRAFT: { label: "Draft", className: "border-border text-muted-foreground" },
  CONFIRMED: { label: "Confirmed", className: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  SHIPPED: { label: "Shipped", className: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  DELIVERED: { label: "Delivered", className: "border-green-500/50 text-green-400 bg-green-500/10" },
  CANCELLED: { label: "Cancelled", className: "border-red-500/50 text-red-400 bg-red-500/10" },
  // Container statuses
  AVAILABLE: { label: "Available", className: "border-green-500/50 text-green-400 bg-green-500/10" },
  ASSIGNED: { label: "Assigned", className: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  IN_TRANSIT: { label: "In Transit", className: "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" },
  // PI statuses
  SENT: { label: "Sent", className: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  ACCEPTED: { label: "Accepted", className: "border-green-500/50 text-green-400 bg-green-500/10" },
  REJECTED: { label: "Rejected", className: "border-red-500/50 text-red-400 bg-red-500/10" },
  // CI statuses
  ISSUED: { label: "Issued", className: "border-green-500/50 text-green-400 bg-green-500/10" },
  // Roles
  ADMIN: { label: "Admin", className: "border-purple-500/50 text-purple-400 bg-purple-500/10" },
  WORKER: { label: "Worker", className: "border-border text-muted-foreground" },
}

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, className: "border-border text-muted-foreground" }
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}

export const CONTAINER_TYPE_LABELS: Record<string, string> = {
  TWENTY_FT: "20FT",
  FORTY_FT: "40FT",
  FORTY_HC: "40HC",
}
