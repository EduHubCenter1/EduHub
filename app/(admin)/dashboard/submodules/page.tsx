"use client";

import { useState, useMemo } from "react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { SubmodulesDataTable } from '@/components/admin/submodules-data-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SubmoduleForm } from "@/components/admin/submodule-form";
import { submodule as Submodule, module as Module, semester as Semester, fields as Field } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubmoduleWithModuleSemesterAndField extends Submodule {
  module: Pick<Module, "name"> & {
    semester: Pick<Semester, "number"> & {
      field: Pick<Field, "name">
    }
  }
}

export default function SubmodulesPage() {
  const { submodules, refetchSubmodules, modules: allModules, semesters: allSemesters, fields: allFields } = useGlobalData();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedSubmodule, setSelectedSubmodule] = useState<SubmoduleWithModuleSemesterAndField | null>(null);
  const [selectedFilterFieldId, setSelectedFilterFieldId] = useState<string | "all">("all");
  const [selectedFilterSemesterId, setSelectedFilterSemesterId] = useState<string | "all">("all");
  const [selectedFilterModuleId, setSelectedFilterModuleId] = useState<string | "all">("all");

  const handleCreate = () => {
    setSelectedSubmodule(null);
    setIsFormOpen(true);
  };

  const handleEdit = (submodule: SubmoduleWithModuleSemesterAndField) => {
    setSelectedSubmodule(submodule);
    setIsFormOpen(true);
  };

  const handleDelete = (submoduleId: string) => {
    setSelectedSubmodule(submodules.find(s => s.id === submoduleId) || null);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedSubmodule) {
      try {
        const response = await fetch(`/api/submodules/${selectedSubmodule.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete submodule.");
        }

        toast({
          title: "Submodule deleted.",
          description: "The submodule has been successfully deleted.",
        });
        refetchSubmodules(); // Refresh data after deletion
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsConfirmDeleteOpen(false);
        setSelectedSubmodule(null);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetchSubmodules(); // Refresh data after create/update
  };

  const filteredSubmodules = useMemo(() => {
    const moduleMap = new Map(allModules.map(m => [m.id, m]));
    const semesterMap = new Map(allSemesters.map(s => [s.id, s]));

    return submodules.filter(submodule => {
      const module = moduleMap.get(submodule.moduleId);
      if (!module) return false;

      const semester = semesterMap.get(module.semesterId);
      if (!semester) return false;

      const fieldMatch = selectedFilterFieldId === "all" || semester.fieldId === selectedFilterFieldId;
      const semesterMatch = selectedFilterSemesterId === "all" || module.semesterId === selectedFilterSemesterId;
      const moduleMatch = selectedFilterModuleId === "all" || submodule.moduleId === selectedFilterModuleId;

      return fieldMatch && semesterMatch && moduleMatch;
    });
  }, [submodules, selectedFilterFieldId, selectedFilterSemesterId, selectedFilterModuleId, allModules, allSemesters]);

  if (!submodules) {
    return (
      <div className={'px-6'}>
        <h1 className="text-2xl font-bold">Submodules</h1>
        <p>Loading submodules...</p>
      </div>
    );
  }

  return (
    <div className={'px-6'}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Submodules</h1>
        <Button onClick={handleCreate}>Add Submodule</Button>
      </div>
      <p>Manage your submodules here.</p>
      <div className="flex items-center space-x-2 mt-4">
        {/* Field Filter */}
        <Select onValueChange={(value) => {
          setSelectedFilterFieldId(value);
          setSelectedFilterSemesterId("all");
          setSelectedFilterModuleId("all");
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

        {/* Semester Filter */}
        <Select onValueChange={(value) => {
          setSelectedFilterSemesterId(value);
          setSelectedFilterModuleId("all");
        }} value={selectedFilterSemesterId}>
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

        {/* Module Filter */}
        <Select onValueChange={(value) => setSelectedFilterModuleId(value)} value={selectedFilterModuleId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {allModules
              .filter(module => {
                  if (selectedFilterSemesterId !== "all") {
                    return module.semesterId === selectedFilterSemesterId;
                  }
                  if (selectedFilterFieldId !== "all") {
                    const semester = allSemesters.find(s => s.id === module.semesterId);
                    return semester && semester.fieldId === selectedFilterFieldId;
                  }
                  return true;
                })
              .map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name} (S{module.semester.number} - {module.semester.field.name})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <SubmodulesDataTable data={filteredSubmodules} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Submodule Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSubmodule ? "Edit Submodule" : "Create Submodule"}</DialogTitle>
          </DialogHeader>
          <SubmoduleForm initialData={selectedSubmodule || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the submodule 
              <span className="font-bold">{selectedSubmodule?.name}</span>.
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
