// app/(admin)/dashboard/users/page.tsx
import { UsersTableShell } from "@/components/admin/users-table-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { getUsers } from "@/lib/data/users"; // Import the new function
import { User } from "@prisma/client";
import {
  Dialog,
  DialogContent, DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateUserForm } from "@/components/admin/create-user-form";

export const dynamic = 'force-dynamic';

// Define a type for AdminScope with included field name
type AdminScopeWithField = {
  userId: string;
  semester: {
    number: number;
  };
  field: {
    name: string;
  };
};

async function getAdminScopes(): Promise<AdminScopeWithField[]> {
  try {
    const adminScopes = await prisma.adminScope.findMany({
      include: {
        field: {
          select: {
            name: true,
          },
        },
        semester: {
          // Include semester to get its number
          select: {
            number: true,
          },
        },
      },
    });
    return adminScopes.map((scope) => ({
      userId: scope.userId,
      semester: { number: scope.semester.number }, // Updated to semester object
      field: { name: scope.field.name },
    }));
  } catch (error) {
    console.error("Failed to fetch admin scopes:", error);
    return [];
  }
}

export default async function UsersPage() {
  // Direct data fetching, no more HTTP requests!
  const users: User[] = await getUsers();
  const adminScopes = await getAdminScopes();

  return (
    <div className={"px-6"}>
      <div className="flex justify-between">
        <div>
          <h1 className=" text-2xl font-bold">Users</h1>
          <p>Manage your users here.</p>
        </div>

        <Dialog>
          <DialogTrigger
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Create User
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new user</DialogTitle>

                <DialogDescription>Fill in the details to create a new admin user.</DialogDescription>

            </DialogHeader>
            <CreateUserForm />
          </DialogContent>
        </Dialog>
      </div>
      <UsersTableShell data={users} adminScopes={adminScopes} />
    </div>
  );
}