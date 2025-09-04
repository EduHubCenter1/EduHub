"use client";

import { useState, useMemo } from "react";
import { useGlobalData } from '@/context/GlobalDataContext';
import { ResourcesDataTable } from '@/components/admin/resources-data-table';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ResourceForm } from "@/components/admin/resource-form";
import { resource as Resource, submodule as Submodule, module as Module, semester as Semester, fields as Field } from "@prisma/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAuth } from "@/hooks/useAuth";

const resourceTypes = [
  { value: "all", label: "All Types" },
  { value: "course", label: "Course" },
  { value: "exam", label: "Exam" },
  { value: "tp_exercise", label: "TP/Exercise" },
  { value: "project", label: "Project" },
  { value: "presentation", label: "Presentation" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
];

// This interface should reflect the data structure from the API
interface ResourceWithRelations extends Resource {
  module: Module & {
    semester: Semester & {
      field: Field;
    };
  };
  submodule: (Submodule & {
    module: Module & {
      semester: Semester & {
        field: Field;
      };
    };
  }) | null;
}

export default function ResourcesPage() {
  const { resources, refetchResources, submodules: allSubmodules, modules: allModules, semesters: allSemesters, fields: allFields } = useGlobalData();
  const { user } = useAuth();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<ResourceWithRelations | null>(null);
  const [selectedFilterFieldId, setSelectedFilterFieldId] = useState<string | "all">("all");
  const [selectedFilterSemesterId, setSelectedFilterSemesterId] = useState<string | "all">("all");
  const [selectedFilterModuleId, setSelectedFilterModuleId] = useState<string | "all">("all");
  const [selectedFilterSubmoduleId, setSelectedFilterSubmoduleId] = useState<string | "all">("all");
  const [selectedFilterTypeId, setSelectedFilterTypeId] = useState<string | "all">("all");
  const [formSelectedModuleId, setFormSelectedModuleId] = useState<string | null>(null);

  const formSubmodules = useMemo(() => {
    if (!formSelectedModuleId) return [];
    return allSubmodules.filter(sm => sm.moduleId === formSelectedModuleId);
  }, [formSelectedModuleId, allSubmodules]);

  const handleCreate = () => {
    setSelectedResource(null);
    setFormSelectedModuleId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (resource: ResourceWithRelations) => {
    setSelectedResource(resource);
    setFormSelectedModuleId(resource.submodule?.moduleId ?? resource.moduleId);
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

        toast.success("Resource deleted.", {
          description: "The resource has been successfully deleted.",
        });
        refetchResources(); // Refresh data after deletion
      } catch (error: any) {
        toast.error("Error", {
          description: error.message || "An unexpected error occurred.",
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
    if (!resources) return [];
    return resources.filter(resource => {
      const resourceModule = resource.submodule?.module ?? resource.module;
      if (!resourceModule) return false;
      
      const resourceSemester = resourceModule.semester;
      if(!resourceSemester) return false;

      if (selectedFilterFieldId !== "all" && resourceSemester.fieldId !== selectedFilterFieldId) {
        return false;
      }
      if (selectedFilterSemesterId !== "all" && resourceSemester.id !== selectedFilterSemesterId) {
        return false;
      }
      if (selectedFilterModuleId !== "all" && resourceModule.id !== selectedFilterModuleId) {
        return false;
      }
      if (selectedFilterSubmoduleId !== "all") {
        if (!resource.submodule || resource.submodule.id !== selectedFilterSubmoduleId) {
          return false;
        }
      }
      if (selectedFilterTypeId !== "all" && resource.type !== selectedFilterTypeId) {
        return false;
      }
      return true;
    });
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
      <div className="flex items-center space-x-2 mt-4">
        {user?.user_metadata?.role === 'superAdmin' && (
          <>
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
                  .filter(semester => selectedFilterFieldId === "all" || semester.fieldId === selectedFilterFieldId)
                  .map((semester) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      Semester {semester.number} ({semester.field.name})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </>
        )}

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

        {/* Submodule Filter */}
        <Select onValueChange={(value) => setSelectedFilterSubmoduleId(value)} value={selectedFilterSubmoduleId}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by Submodule" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submodules</SelectItem>
            {allSubmodules
              .filter(submodule => {
                if (selectedFilterModuleId !== "all") {
                  return submodule.moduleId === selectedFilterModuleId;
                }
                const module = allModules.find(m => m.id === submodule.moduleId);
                if (!module) return false;

                if (selectedFilterSemesterId !== "all") {
                  return module.semesterId === selectedFilterSemesterId;
                }
                if (selectedFilterFieldId !== "all") {
                  const semester = allSemesters.find(s => s.id === module.semesterId);
                  return semester && semester.fieldId === selectedFilterFieldId;
                }
                return true;
              })
              .map((submodule) => (
                <SelectItem key={submodule.id} value={submodule.id}>
                  {submodule.name} (M: {submodule.module.name} | S: {submodule.module.semester.number} | F: {submodule.module.semester.field.name})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Type Filter */}
        <Select onValueChange={(value) => setSelectedFilterTypeId(value)} value={selectedFilterTypeId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            {resourceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="">
        <ResourcesDataTable data={filteredResources} onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      {/* Resource Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedResource ? "Edit Resource" : "Create Resource"}</DialogTitle>
          </DialogHeader>
          <ResourceForm 
            initialData={selectedResource || undefined} 
            onSuccess={handleFormSuccess}
            onModuleChange={setFormSelectedModuleId}
            submodules={formSubmodules}
          />
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
