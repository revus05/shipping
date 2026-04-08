import { UserForm } from "@/components/users/user-form"
import { PageHeader } from "@/components/shared/page-header"

export default function NewUserPage() {
  return (
    <div className="max-w-lg">
      <PageHeader title="New User" description="Create a new user account." />
      <div className="rounded-lg border border-border bg-card p-6">
        <UserForm apiPath="/api/users" />
      </div>
    </div>
  )
}
