"use client";

import { useState, useMemo } from "react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { ResourcesDataTable } from '@/components/admin/resources-data-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ResourceForm } from "@/components/admin/resource-form";
import { resource as Resource, submodule as Submodule, module as Module, semester as Semester, fields as Field } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceWithSubmoduleModuleSemesterAndField extends Resource {
  submodule: Pick<Submodule, "name"> & {
    module: Pick<Module, "name"> & {
      semester: Pick<Semester, "number"> & {
        field: Pick<Field, "name">
      }
    }
  }
}

export default function ResourcesPage() {
  const { resources, refetchResources, submodules: allSubmodules, modules: allModules, semesters: allSemesters, fields: allFields } = useGlobalData();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceWithSubmoduleModuleSemesterAndField | null>(null);
  const [selectedFilterFieldId, setSelectedFilterFieldId] = useState<string | "all">("all");
  const [selectedFilterSemesterId, setSelectedFilterSemesterId] = useState<string | "all">("all");
  const [selectedFilterModuleId, setSelectedFilterModuleId] = useState<string | "all">("all");
  const [selectedFilterSubmoduleId, setSelectedFilterSubmoduleId] = useState<string | "all">("all");

  const handleCreate = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleEdit = (resource: ResourceWithSubmoduleModuleSemesterAndField) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleDelete = (resourceId: string) => {
    setSelectedResource(resources.find(r => r.id === resourceId) || null);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedResource) {
      try {
        const response = await fetch(`/api/resources/${selectedResource.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete resource.");
        }

        toast({
          title: "Resource deleted.",
          description: "The resource has been successfully deleted.",
        });
        refetchResources(); // Refresh data after deletion
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsConfirmDeleteOpen(false);
        setSelectedResource(null);
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    refetchResources(); // Refresh data after create/update
  };

  const filteredResources = useMemo(() => {
    let filtered = resources;

    if (selectedFilterFieldId !== "all") {
      filtered = filtered.filter(resource => resource.submodule.module.semester.field.id === selectedFilterFieldId);
    }

    if (selectedFilterSemesterId !== "all") {
      filtered = filtered.filter(resource => resource.submodule.module.semesterId === selectedFilterSemesterId);
    }

    if (selectedFilterModuleId !== "all") {
      filtered = filtered.filter(resource => resource.submodule.moduleId === selectedFilterModuleId);
    }

    if (selectedFilterSubmoduleId !== "all") {
      filtered = filtered.filter(resource => resource.submoduleId === selectedFilterSubmoduleId);
    }

    return filtered;
  }, [resources, selectedFilterFieldId, selectedFilterSemesterId, selectedFilterModuleId, selectedFilterSubmoduleId]);

  if (!resources) {
    return (
      <div className={'px-6'}>
        <h1 className="text-2xl font-bold">Resources</h1>
        <p>Loading resources...</p>
      </div>
    );
  }

  return (
    <div className={'px-6'}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Button onClick={handleCreate}>Add Resource</Button>
      </div>
      <p>Manage your resources here.</p>
      <div className="flex items-center space-x-2 mb-4">
        {/* Field Filter */}
        <Select onValueChange={(value) => {
          setSelectedFilterFieldId(value);
          setSelectedFilterSemesterId("all");
          setSelectedFilterModuleId("all");
          setSelectedFilterSubmoduleId("all");
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
          setSelectedFilterSubmoduleId("all");
        }} value={selectedFilterSemesterId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {allSemesters
              .filter(semester => selectedFilterFieldId === "all" || semester.field.id === selectedFilterFieldId)
              .map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  Semester {semester.number}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Module Filter */}
        <Select onValueChange={(value) => {
          setSelectedFilterModuleId(value);
          setSelectedFilterSubmoduleId("all");
        }} value={selectedFilterModuleId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by Module" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modules</SelectItem>
            {allModules
              .filter(module => 
                (selectedFilterFieldId === "all" || module.semester.field.id === selectedFilterFieldId) &&
                (selectedFilterSemesterId === "all" || module.semesterId === selectedFilterSemesterId)
              )
              .map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name} (S{module.semester.number} - {module.semester.field.name})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Submodule Filter */}
        <Select onValueChange={(value) => setSelectedFilterSubmoduleId(value)} value={selectedFilterSubmoduleId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by Submodule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submodules</SelectItem>
            {allSubmodules
              .filter(submodule => 
                (selectedFilterFieldId === "all" || submodule.module.semester.field.id === selectedFilterFieldId) &&
                (selectedFilterSemesterId === "all" || submodule.module.semesterId === selectedFilterSemesterId) &&
                (selectedFilterModuleId === "all" || submodule.moduleId === selectedFilterModuleId)
              )
              .map((submodule) => (
                <SelectItem key={submodule.id} value={submodule.id}>
                  {submodule.name} (M: {submodule.module.name} | S: {submodule.module.semester.number} | F: {submodule.module.semester.field.name})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4">
        <ResourcesDataTable data={filteredResources} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Resource Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedResource ? "Edit Resource" : "Create Resource"}</DialogTitle>
          </DialogHeader>
          <ResourceForm initialData={selectedResource || undefined} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the resource 
              <span className="font-bold">{selectedResource?.title}</span>.
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
