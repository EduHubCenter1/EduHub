"use client"

import { ColumnDef } from "@tanstack/react-table"
import { module as Module, semester as Semester, fields as Field } from "@prisma/client"
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

interface ModuleWithSemesterAndField extends Module {
  semester: Pick<Semester, "number"> & {
    field: Pick<Field, "name">
  }
}

interface ModulesDataTableProps {
  data: ModuleWithSemesterAndField[]
  onEdit: (module: ModuleWithSemesterAndField) => void
  onDelete: (moduleId: string) => void
}

export function ModulesDataTable({ data, onEdit, onDelete }: ModulesDataTableProps) {
  const columns: ColumnDef<ModuleWithSemesterAndField>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      accessorKey: "name",
      header: "Module Name",
    },
    {
      accessorKey: "semester.number",
      header: "Semester Number",
    },
    {
      accessorKey: "semester.field.name",
      header: "Field Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const module = row.original

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
                onClick={() => navigator.clipboard.writeText(module.id)}
              >
                Copy module ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(module)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(module.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <FieldsDataTable columns={columns} data={data} filterColumnId="name" />
}
