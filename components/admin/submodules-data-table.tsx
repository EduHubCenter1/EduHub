"use client"

import { ColumnDef } from "@tanstack/react-table"
import { submodule as Submodule, module as Module, semester as Semester, fields as Field } from "@prisma/client"
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

interface SubmoduleWithModuleSemesterAndField extends Submodule {
  module: Pick<Module, "name"> & {
    semester: Pick<Semester, "number"> & {
      field: Pick<Field, "name">
    }
  }
}

interface SubmodulesDataTableProps {
  data: SubmoduleWithModuleSemesterAndField[]
  onEdit: (submodule: SubmoduleWithModuleSemesterAndField) => void
  onDelete: (submoduleId: string) => void
}

export function SubmodulesDataTable({ data, onEdit, onDelete }: SubmodulesDataTableProps) {
  const columns: ColumnDef<SubmoduleWithModuleSemesterAndField>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Submodule Name",
    },
    {
      accessorKey: "module.name",
      header: "Module Name",
    },
    {
      accessorKey: "module.semester.number",
      header: "Semester Number",
    },
    {
      accessorKey: "module.semester.field.name",
      header: "Field Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const submodule = row.original

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
                onClick={() => navigator.clipboard.writeText(submodule.id)}
              >
                Copy submodule ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(submodule)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(submodule.id)}>
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
