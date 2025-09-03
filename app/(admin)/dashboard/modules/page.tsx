"use client";

import { useState, useMemo } from "react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { ModulesDataTable } from '@/components/admin/modules-data-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ModuleForm } from "@/components/admin/module-form";
import { module as Module, semester as Semester, fields as Field } from "@prisma/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModuleWithSemesterAndField extends Module {
  semester: Pick<Semester, "number"> & {
    field: Pick<Field, "name">
  }
}

import { useAuth } from "@/hooks/useAuth";

export default function ModulesPage() {
  const { modules, refetchModules, semesters: allSemesters, fields: allFields } = useGlobalData();
  const { user } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<ModuleWithSemesterAndField | null>(null);
  const [selectedFilterSemesterId, setSelectedFilterSemesterId] = useState<string | "all">("all");
  const [selectedFilterFieldId, setSelectedFilterFieldId] = useState<string | "all">("all");

  const handleCreate = () => {
    setSelectedModule(null);
    setIsFormOpen(true);
  };

  const handleEdit = (module: ModuleWithSemesterAndField) => {
    setSelectedModule(module);
    setIsFormOpen(true);
  };

  const handleDelete = (moduleId: string) => {
    setSelectedModule(modules.find(m => m.id === moduleId) || null);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedModule) {
      try {
        const response = await fetch(`/api/modules/${selectedModule.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete module.");
        }

        toast.success("Module deleted.", {
          description: "The module has been successfully deleted.",
        });
        refetchModules(); // Refresh data after deletion
      } catch (error: any) {
        toast.error("Error", {
          description: error.message || "An unexpected error occurred.",
        });
      } finally {
        setIsConfirmDeleteOpen(false);
        setSelectedModule(null);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetchModules(); // Refresh data after create/update
  };

  const filteredModules = useMemo(() => {
    let filtered = modules;

    if (selectedFilterFieldId !== "all") {
      const semesterIdsInField = new Set(
        allSemesters
          .filter(s => s.fieldId === selectedFilterFieldId)
          .map(s => s.id)
      );
      filtered = filtered.filter(module => semesterIdsInField.has(module.semesterId));
    }

    if (selectedFilterSemesterId !== "all") {
      filtered = filtered.filter(module => module.semesterId === selectedFilterSemesterId);
    }

    return filtered;
  }, [modules, selectedFilterSemesterId, selectedFilterFieldId, allSemesters]);

  if (!modules) {
    return (
      <div className={'px-6'}>
        <h1 className="text-2xl font-bold">Modules</h1>
        <p>Loading modules...</p>
      </div>
    );
  }

  return (
    <div className={'px-6'}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Modules</h1>
        <Button onClick={handleCreate}>Add Module</Button>
      </div>
      <p>Manage your modules here.</p>
      {user?.user_metadata?.role === 'superAdmin' && (
        <div className="flex items-center space-x-2 mt-4">
          <Select onValueChange={(value) => {
            setSelectedFilterFieldId(value);
            setSelectedFilterSemesterId("all");
          }} value={selectedFilterFieldId}>
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

          <Select onValueChange={(value) => setSelectedFilterSemesterId(value)} value={selectedFilterSemesterId}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Filter by Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {allSemesters
                .filter(semester => selectedFilterFieldId === "all" || semester.fieldId === selectedFilterFieldId)
                .map((semester) => (
                  <SelectItem key={semester.id} value={semester.id}>
                    Semester {semester.number} ({semester.field.name})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="">
        <ModulesDataTable data={filteredModules} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Module Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedModule ? "Edit Module" : "Create Module"}</DialogTitle>
          </DialogHeader>
          <ModuleForm initialData={selectedModule || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the module 
              <span className="font-bold">{selectedModule?.name}</span>.
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
