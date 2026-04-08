import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { UserForm } from "@/components/users/user-form"
import { PageHeader } from "@/components/shared/page-header"

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true },
  })
  if (!user) notFound()

  return (
    <div className="max-w-lg">
      <PageHeader title="Edit User" description={user.name} />
      <div className="rounded-lg border border-border bg-card p-6">
        <UserForm
          defaultValues={{
            name: user.name,
            email: user.email,
            role: user.role as "ADMIN" | "WORKER",
            password: "",
          }}
          apiPath={`/api/users/${id}`}
          method="PUT"
          isEdit
        />
      </div>
    </div>
  )
}
