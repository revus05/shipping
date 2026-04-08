import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { db } from "@/lib/db"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable, type Column } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { DeleteUserButton } from "@/components/users/delete-user-button"

type UserRow = { id: string; email: string; name: string; role: string; createdAt: Date }

export default async function UsersPage() {
  const users = await db.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  })

  const columns: Column<UserRow>[] = [
    { key: "name", header: "Name", render: (u) => <span className="font-medium">{u.name}</span> },
    { key: "email", header: "Email", render: (u) => u.email },
    { key: "role", header: "Role", render: (u) => <StatusBadge status={u.role} /> },
    { key: "joined", header: "Joined", render: (u) => new Date(u.createdAt).toLocaleDateString() },
    {
      key: "actions",
      header: "",
      className: "w-24 text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href={`/users/${u.id}/edit`}>
              <Pencil className="h-3.5 w-3.5" />
            </Link>
          </Button>
          <DeleteUserButton id={u.id} name={u.name} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="User Management"
        description={`${users.length} users`}
        action={
          <Button asChild size="sm">
            <Link href="/users/new">
              <Plus className="mr-1 h-4 w-4" /> New User
            </Link>
          </Button>
        }
      />
      <DataTable columns={columns} data={users} emptyMessage="No users yet." />
    </div>
  )
}
