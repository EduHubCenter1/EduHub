"use client"

import * as React from "react"
import { fields as Field } from "@prisma/client"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useGlobalData } from "@/context/GlobalDataContext"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { FieldsDataTable } from "./fields-data-table"
import { FieldForm } from "./field-form"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface FieldsTableShellProps {
  // data: Field[] // No longer needed as data comes from context
}

export function FieldsTableShell({ /* data */ }: FieldsTableShellProps) {
  const router = useRouter()
  const { fields, refetchFields } = useGlobalData()
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [currentField, setCurrentField] = React.useState<Field | undefined>(
    undefined
  )

  const handleEdit = (field: Field) => {
    setCurrentField(field)
    setIsEditOpen(true)
  }

  const handleDelete = (field: Field) => {
    setCurrentField(field)
    setIsDeleteOpen(true)
  }

  const onDeleteConfirm = async () => {
    if (!currentField) return

    try {
      const response = await fetch(`/api/fields/${currentField.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }
      toast.success(data.message || "Field deleted successfully")
      refetchFields()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeleteOpen(false)
      setCurrentField(undefined)
    }
  }

  const columns: ColumnDef<Field>[] = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as string
        return (
          <div className="truncate max-w-xs">{description || "-"}</div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const field = row.original
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
              <DropdownMenuItem onClick={() => handleEdit(field)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/fields/${field.id}/semesters`)}>
                View Semesters
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(field)}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new field</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new field.
              </DialogDescription>
            </DialogHeader>
            <FieldForm onSubmitSuccess={() => {
              setIsCreateOpen(false);
              refetchFields();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <FieldsDataTable columns={columns} data={fields} />

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Update the details for this field.
            </DialogDescription>
          </DialogHeader>
          <FieldForm
            field={currentField}
            onSubmitSuccess={() => {
              setIsEditOpen(false);
              refetchFields();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              field and all associated data (semesters, modules, etc.).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
