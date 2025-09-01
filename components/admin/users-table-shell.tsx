'use client'

import * as React from "react"
import { User } from "@supabase/supabase-js"
import { MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

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
import { // Import Dialog components
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditUserForm } from "./edit-user-form" // Import EditUserForm
import { deleteUser } from "@/app/(admin)/dashboard/users/actions" // Import the server action

// Define a type for AdminScope with included field name (must match the type from page.tsx)
type AdminScopeWithField = {
  userId: string;
  semester: {
    number: number;
  };
  field: {
    name: string;
  };
};

interface UsersTableShellProps {
  data: User[];
  adminScopes: AdminScopeWithField[]; // Add adminScopes prop
}

export function UsersTableShell({ data, adminScopes }: UsersTableShellProps) {
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined)
  const [isEditOpen, setIsEditOpen] = React.useState(false) // State for edit dialog
  const [currentUser, setCurrentUser] = React.useState<User | undefined>(undefined) // State for current user being edited

  const handleDelete = (userId: string) => {
    setCurrentUserId(userId)
    setIsDeleteOpen(true)
  }

  const handleEdit = (user: User) => {
    setCurrentUser(user)
    setIsEditOpen(true)
  }

  const onEditSubmitSuccess = () => {
    setIsEditOpen(false);
    setCurrentUser(undefined);
    window.location.reload(); // Refresh user list after edit
  }

  const onDeleteConfirm = async () => {
    if (!currentUserId) return

    try {
      const result = await deleteUser(currentUserId);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(result.success || "User deleted successfully");
      window.location.reload(); // Refresh user list after delete
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
      accessorKey: "full_name",
      header: "Full Name",
      cell: ({ row }) => {
        const firstName = row.original.user_metadata?.firstName || "";
        const lastName = row.original.user_metadata?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        return <span>{fullName || "-"}</span>;
      }
    },
    {
        accessorKey: "user_metadata.role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.user_metadata?.role || "user";
            let variant: "default" | "secondary" | "destructive" | "outline" = "default";
            let className = "";

            if (role === 'superAdmin') {
                variant = 'destructive'; // Red for superAdmin
            } else if (role === 'classAdmin') {
                className = "bg-green-500 text-white hover:bg-green-600"; // Green for classAdmin
            }

            return <Badge variant={variant} className={className}>{role}</Badge>
        }
    },
    {
      accessorKey: "admin_scopes", // New column for admin scopes
      header: "Admin Scopes",
      cell: ({ row }) => {
        const userRole = row.original.user_metadata?.role;
        if (userRole !== 'classAdmin') {
          return <span>-</span>; // Only show for classAdmin
        }

        const userAdminScopes = adminScopes.filter(scope => scope.userId === row.original.id);

        if (userAdminScopes.length === 0) {
          return <span>No scopes assigned</span>;
        }

        const formattedScopes = userAdminScopes.map(scope =>
          `${scope.field.name} (S${scope.semester.number})`
        ).join(', ');

        return (
          <span>{formattedScopes}</span>
        );
      },
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
              <DropdownMenuItem onClick={() => handleEdit(user)}> {/* Trigger edit */}
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(user.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the details for this user.
            </DialogDescription>
          </DialogHeader>
          {currentUser && ( // Render form only if currentUser is set
            <EditUserForm user={currentUser} onSubmitSuccess={onEditSubmitSuccess} />
          )}
        </DialogContent>
      </Dialog>

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
            <AlertDialogAction onClick={onDeleteConfirm} className="bg-red-500 hover:bg-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
