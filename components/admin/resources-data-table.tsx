"use client"

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
import { Badge } from "@/components/ui/badge" // Added import for Badge

enum ResourceStatus {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}

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
  onApprove: (resourceId: string) => void
}

export function ResourcesDataTable({ data, onEdit, onDelete, onApprove }: ResourcesDataTableProps) {
  const columns: ColumnDef<ResourceWithRelations>[] = [
    // {
    //   accessorKey: "id",
    //   header: "ID",
    // },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <a
          href={`/api/files/${row.original.id}/download`}
          className="underline hover:text-blue-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          {row.original.title}
        </a>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status: ResourceStatus = row.original.status as ResourceStatus; // Cast to ResourceStatus
        return (
          <Badge
            variant={
              status === ResourceStatus.approved
                ? "default"
                : status === ResourceStatus.pending
                ? "secondary"
                : "destructive"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      id: "moduleSubmodule",
      header: "Module:Submodule",
      cell: ({ row }) => row.original.submodule ? `${row.original.module.name} : ${row.original.submodule.name}` : row.original.module.name,
    },
    {
      id: "filiereSemestre",
      header: "Filiere-Semestre",
      cell: ({ row }) => `${row.original.module.semester.field.name}-S${row.original.module.semester.number}`,
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
              {resource.status === "pending" && (
                <DropdownMenuItem onClick={() => onApprove(resource.id)}>
                  Approve
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <FieldsDataTable columns={columns} data={data} filterColumnId="title" />
}
