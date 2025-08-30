"use client"

import { ColumnDef } from "@tanstack/react-table"
import { resource as Resource, submodule as Submodule, module as Module, semester as Semester, fields as Field } from "@prisma/client"
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

interface ResourceWithSubmoduleModuleSemesterAndField extends Resource {
  submodule: Pick<Submodule, "name"> & {
    module: Pick<Module, "name"> & {
      semester: Pick<Semester, "number"> & {
        field: Pick<Field, "name">
      }
    }
  }
}

interface ResourcesDataTableProps {
  data: ResourceWithSubmoduleModuleSemesterAndField[]
  onEdit: (resource: ResourceWithSubmoduleModuleSemesterAndField) => void
  onDelete: (resourceId: string) => void
}

export function ResourcesDataTable({ data, onEdit, onDelete }: ResourcesDataTableProps) {
  const columns: ColumnDef<ResourceWithSubmoduleModuleSemesterAndField>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "submodule.name",
      header: "Submodule Name",
    },
    {
      accessorKey: "submodule.module.name",
      header: "Module Name",
    },
    {
      accessorKey: "submodule.module.semester.number",
      header: "Semester Number",
    },
    {
      accessorKey: "submodule.module.semester.field.name",
      header: "Field Name",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const resource = row.original

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
                onClick={() => navigator.clipboard.writeText(resource.id)}
              >
                Copy resource ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(resource)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(resource.id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <FieldsDataTable columns={columns} data={data} filterColumnId="title" />
}
