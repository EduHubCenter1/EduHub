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

interface ResourceWithRelations extends Resource {
  module: Module & {
    semester: Semester & {
      field: Field;
    };
  };
  submodule: (Submodule & {
    module: Module & {
      semester: Semester & {
        field: Field;
      };
    };
  }) | null;
}

interface ResourcesDataTableProps {
  data: ResourceWithRelations[]
  onEdit: (resource: ResourceWithRelations) => void
  onDelete: (resourceId: string) => void
}

export function ResourcesDataTable({ data, onEdit, onDelete }: ResourcesDataTableProps) {
  const columns: ColumnDef<ResourceWithRelations>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
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
      cell: ({ row }) => row.original.submodule?.name || "--",
    },
    {
      accessorKey: "module.name",
      header: "Module Name",
      cell: ({ row }) => row.original.module.name,
    },
    {
      accessorKey: "module.semester.number",
      header: "Semester Number",
      cell: ({ row }) => row.original.module.semester.number,
    },
    {
      accessorKey: "module.semester.field.name",
      header: "Field Name",
      cell: ({ row }) => row.original.module.semester.field.name,
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
