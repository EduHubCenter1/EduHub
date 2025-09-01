"use client"

import { ColumnDef } from "@tanstack/react-table"
import { semester, fields } from "@prisma/client"
import { FieldsDataTable } from "./fields-data-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface SemesterWithField extends semester {
  field: Pick<fields, "name">
}

interface SemestersDataTableProps {
  data: SemesterWithField[]
  onEdit: (semester: SemesterWithField) => void
  onDelete: (semesterId: string) => void
}

export function SemestersDataTable({ data, onEdit, onDelete }: SemestersDataTableProps) {
  const columns: ColumnDef<SemesterWithField>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      accessorKey: "field.name",
      header: "Field Name",
      id: "field.name",
    },
    {
      accessorKey: "number",
      header: "Semester Number",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const semester = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(semester.id)}
              >
                Copy semester ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(semester)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(semester.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <FieldsDataTable columns={columns} data={data} filterColumnId="field.name" />
}
