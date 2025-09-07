// app/(admin)/dashboard/pending-documents/page.tsx
"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table"; // Assuming you have a generic DataTable component
import { Resource } from "@prisma/client"; // Import Prisma Resource type
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Server actions for approval/rejection (will be created next)
import { approveResource, rejectResource } from "./actions";

interface PendingDocumentsPageProps {
  // This page will fetch its own data on the server, but for client-side rendering
  // or if data is passed from a layout, we define props.
}

export default function PendingDocumentsPage(props: PendingDocumentsPageProps) {
  const [pendingResources, setPendingResources] = React.useState<Resource[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedResourceId, setSelectedResourceId] = React.useState<string | null>(null);
  const [actionType, setActionType] = React.useState<"approve" | "reject" | null>(null);

  const fetchPendingResources = async () => {
    setIsLoading(true);
    try {
      // This will be an API route or server action to fetch pending resources
      const response = await fetch("/api/resources?status=pending");
      if (!response.ok) {
        throw new Error("Failed to fetch pending resources.");
      }
      const data = await response.json();
      setPendingResources(data);
    } catch (error: any) {
      toast.error(error.message || "Error fetching pending resources.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendingResources();
  }, []);

  const handleAction = (resourceId: string, type: "approve" | "reject") => {
    setSelectedResourceId(resourceId);
    setActionType(type);
    setIsAlertOpen(true);
  };

  const onConfirmAction = async () => {
    if (!selectedResourceId || !actionType) return;

    setIsLoading(true);
    try {
      let result;
      if (actionType === "approve") {
        result = await approveResource(selectedResourceId);
      } else {
        result = await rejectResource(selectedResourceId);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(result.success || `Resource ${actionType}d successfully.`);
      fetchPendingResources(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || `Failed to ${actionType} resource.`);
    } finally {
      setIsLoading(false);
      setIsAlertOpen(false);
      setSelectedResourceId(null);
      setActionType(null);
    }
  };

  const columns: ColumnDef<Resource>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
    },
    {
      accessorKey: "uploadedByUserId",
      header: "Uploaded By",
      cell: ({ row }) => {
        // You might want to fetch the user's name here based on uploadedByUserId
        return <span>{row.original.uploadedByUserId}</span>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Submitted On",
      cell: ({ row }) => {
        return format(new Date(row.original.createdAt), "PPP", { locale: fr });
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleAction(row.original.id, "approve")}>
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction(row.original.id, "reject")}>
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(row.original.fileUrl, "_blank")}
            >
              View Document
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Documents for Review</h1>
      {isLoading ? (
        <div>Loading pending documents...</div>
      ) : pendingResources.length === 0 ? (
        <div>No pending documents to review.</div>
      ) : (
        <DataTable columns={columns} data={pendingResources} />
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {actionType} this document?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
