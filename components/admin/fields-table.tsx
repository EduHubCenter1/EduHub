"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Trash2, Eye } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Field {
  id: string
  name: string
  slug: string
  description: string | null
  _count: {
    semesters: number
  }
}

interface FieldsTableProps {
  fields: Field[]
}

export function FieldsTable({ fields }: FieldsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    // TODO: Implement delete functionality
    console.log("Delete field:", id)
    setDeletingId(null)
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Semesters</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field) => (
            <TableRow key={field.id}>
              <TableCell className="font-medium">{field.name}</TableCell>
              <TableCell>
                <code className="text-sm bg-muted px-2 py-1 rounded">{field.slug}</code>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {field.description || <span className="text-muted-foreground">No description</span>}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{field._count.semesters}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/fields/${field.slug}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/fields/${field.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={deletingId === field.id}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Field</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{field.name}"? This will also delete all associated
                          semesters, modules, submodules, and resources. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(field.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
