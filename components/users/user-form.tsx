"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EntityForm } from "@/components/shared/entity-form"
import { createUserSchema, type CreateUserFormValues } from "@/lib/validations/user"

interface UserFormProps {
  apiPath: string
  method?: "POST" | "PUT"
  defaultValues?: Partial<CreateUserFormValues>
  isEdit?: boolean
}

export function UserForm({ apiPath, method = "POST", defaultValues = {}, isEdit = false }: UserFormProps) {
  return (
    <EntityForm
      schema={createUserSchema}
      defaultValues={{ role: "WORKER", ...defaultValues }}
      apiPath={apiPath}
      method={method}
      redirectPath="/users"
    >
      {(form) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="WORKER">Worker</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password *</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>Minimum 8 characters.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </EntityForm>
  )
}
