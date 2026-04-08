import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Column<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function DataTable<T>({ columns, data, emptyMessage = "No records found." }: DataTableProps<T>) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.className ?? "text-muted-foreground text-xs uppercase tracking-wider font-medium"}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={idx} className="border-b border-border last:border-0">
                {columns.map((col) => (
                  <TableCell key={col.key}>{col.render(row)}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
