"use client";

import { useState, useMemo } from "react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { SemestersDataTable } from '@/components/admin/semesters-data-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SemesterForm } from "@/components/admin/semester-form";
import { semester, fields } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SemesterWithField extends semester {
  field: Pick<fields, "name">
}

export default function SemestersPage() {
  const { semesters, refetchSemesters, fields: allFields } = useGlobalData();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<SemesterWithField | null>(null);
  const [selectedFilterFieldId, setSelectedFilterFieldId] = useState<string | "all">("all");

  const handleCreate = () => {
    setSelectedSemester(null);
    setIsFormOpen(true);
  };

  const handleEdit = (semester: SemesterWithField) => {
    setSelectedSemester(semester);
    setIsFormOpen(true);
  };

  const handleDelete = (semesterId: string) => {
    setSelectedSemester(semesters.find(s => s.id === semesterId) || null);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSemester) {
      try {
        const response = await fetch(`/api/semesters/${selectedSemester.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete semester.");
        }

        toast({
          title: "Semester deleted.",
          description: "The semester has been successfully deleted.",
        });
        refetchSemesters(); // Refresh data after deletion
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsConfirmDeleteOpen(false);
        setSelectedSemester(null);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetchSemesters(); // Refresh data after create/update
  };

  const filteredSemesters = useMemo(() => {
    if (selectedFilterFieldId === "all") {
      return semesters;
    }
    return semesters.filter(semester => semester.fieldId === selectedFilterFieldId);
  }, [semesters, selectedFilterFieldId]);

  if (!semesters) {
    return (
      <div className={'px-6'}>
        <h1 className="text-2xl font-bold">Semesters</h1>
        <p>Loading semesters...</p>
      </div>
    );
  }

  return (
    <div className={'px-6'}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Semesters</h1>
        <Button onClick={handleCreate}>Add Semester</Button>
      </div>
      <p>Manage your semesters here.</p>
      <div className="flex items-center space-x-2 mt-4">
        <Select onValueChange={(value) => setSelectedFilterFieldId(value)} value={selectedFilterFieldId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fields</SelectItem>
            {allFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-2">
        <SemestersDataTable data={filteredSemesters} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Semester Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSemester ? "Edit Semester" : "Create Semester"}</DialogTitle>
          </DialogHeader>
          <SemesterForm initialData={selectedSemester || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the semester 
              <span className="font-bold">{selectedSemester?.number}</span> 
              from field <span className="font-bold">{selectedSemester?.field.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

