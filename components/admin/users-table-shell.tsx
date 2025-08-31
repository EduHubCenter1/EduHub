'use client'

import * as React from "react"
import { User } from "@supabase/supabase-js"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner" // Import toast

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { UsersDataTable } from "./users-data-table"
import { Badge } from "@/components/ui/badge"
import { // Import AlertDialog components
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UsersTableShellProps {
  data: User[]
}

export function UsersTableShell({ data }: UsersTableShellProps) {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined)

  const handleDelete = (userId: string) => {
    setCurrentUserId(userId)
    setIsDeleteOpen(true)
  }

  const onDeleteConfirm = async () => {
    if (!currentUserId) return

    try {
      const response = await fetch(`/api/users/${currentUserId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong")
      }
      toast.success(result.message || "User deleted successfully")
      // TODO: Refresh user list - currently, the page is a Server Component,
      // so we need to revalidate the path or refetch data.
      // For now, a full page refresh might be needed or pass a refetch function from parent.
      // A simple way for now is to trigger a revalidation of the page.
      // This would typically be done by revalidatePath in the API route,
      // but since this is a client component, we can't directly call it.
      // For a quick solution, we can reload the window, but it's not ideal.
      // A better approach would be to pass a refetch function from the parent page.
      // For now, let's assume the parent page will handle revalidation or we'll reload.
      window.location.reload(); // Temporary solution for refreshing data
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsDeleteOpen(false)
      setCurrentUserId(undefined)
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "user_metadata.full_name",
      header: "Full Name",
      cell: ({ row }) => {
        return <span>{row.original.user_metadata.full_name || "-"}</span>
      }
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role
            return <Badge variant={role === 'admin' ? 'destructive' : 'default'}>{role}</Badge>
        }
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
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
              <DropdownMenuItem>
                Edit {/* Placeholder for future edit functionality */}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(user.id)} // Trigger delete
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
      <UsersDataTable columns={columns} data={data} />

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user.
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