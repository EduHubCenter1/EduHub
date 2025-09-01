"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { resource as Resource, submodule as Submodule, module as Module, semester as Semester, fields as Field } from "@prisma/client"
import { useState, useMemo, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { resourceFormSchema, resourceTypeSchema } from "@/lib/validators"
import { useGlobalData } from "@/context/GlobalDataContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"

type SubmoduleWithRelations = Submodule & {
  module: Module & {
    semester: Semester & {
      field: Field
    }
  }
}

interface ResourceFormProps {
  initialData?: Resource
  onSuccess?: () => void
  onModuleChange?: (moduleId: string | null) => void
  submodules?: SubmoduleWithRelations[]
}

export function ResourceForm({ initialData, onSuccess, onModuleChange, submodules = [] }: ResourceFormProps) {
  const { toast } = useToast()
  const { 
    fields, 
    semesters, 
    modules, 
    submodules: allSubmodules 
  } = useGlobalData()
  const router = useRouter()

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resourceFormSchema>>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || undefined,
      description: initialData?.description || "",
      moduleId: initialData?.moduleId || undefined,
      submoduleId: initialData?.submoduleId || undefined,
    },
    shouldUnregister: false, // Keep field values even if unregistered
  })

  useEffect(() => {
    if (initialData?.moduleId && allSubmodules.length > 0 && modules.length > 0 && semesters.length > 0) {
        const module = modules.find(m => m.id === initialData.moduleId);
        if (module) {
            const semester = semesters.find(s => s.id === module.semesterId);
            if (semester) {
                setSelectedFieldId(semester.fieldId);
                setSelectedSemesterId(semester.id);
                onModuleChange?.(module.id);
                form.setValue('moduleId', module.id)
                if(initialData.submoduleId) {
                  form.setValue('submoduleId', initialData.submoduleId);
                }
            }
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, allSubmodules, modules, semesters]);

  const filteredSemesters = useMemo(() => {
    if (!selectedFieldId) return [];
    return semesters.filter(s => s.fieldId === selectedFieldId);
  }, [selectedFieldId, semesters]);

  const filteredModules = useMemo(() => {
    if (!selectedSemesterId) return [];
    return modules.filter(m => m.semesterId === selectedSemesterId);
  }, [selectedSemesterId, modules]);

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof resourceFormSchema>) {
    try {
      const submissionValues = { ...values };
      const moduleHasSubmodules = submodules.length > 0;

      if (moduleHasSubmodules && !submissionValues.submoduleId) {
        toast({
          title: "Error",
          description: "Submodule is required for the selected module.",
          variant: "destructive",
        });
        return; // Stop submission
      }

      if (!moduleHasSubmodules) {
        submissionValues.submoduleId = '1'; // Use placeholder ID
      }

      let response
      const formData = new FormData()

      // Append metadata fields
      formData.append("title", submissionValues.title)
      formData.append("type", submissionValues.type)
      formData.append("description", submissionValues.description || "")
      formData.append("moduleId", submissionValues.moduleId)
      if (submissionValues.submoduleId) {
        formData.append("submoduleId", submissionValues.submoduleId)
      }

      if (initialData) {
        // Update existing resource
        const updatePayload: any = {
          title: submissionValues.title,
          type: submissionValues.type,
          description: submissionValues.description,
          moduleId: submissionValues.moduleId,
          submoduleId: submissionValues.submoduleId,
        }

        if (values.file) {
          formData.append("file", values.file)
          response = await fetch("/api/upload", { method: "POST", body: formData })
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "File upload failed.")
          }
          const uploadResult = await response.json()
          updatePayload.fileUrl = uploadResult.resource.fileUrl;
          updatePayload.sizeBytes = uploadResult.resource.sizeBytes;
          updatePayload.sha256 = uploadResult.resource.sha256;
          updatePayload.fileExt = uploadResult.resource.fileExt;
          updatePayload.mimeType = uploadResult.resource.mimeType;
        }

        response = await fetch(`/api/resources/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        })

      } else {
        // Create new resource (requires a file)
        if (!values.file) {
          throw new Error("File is required for new resources.")
        }
        formData.append("file", values.file)

        // First, upload the file
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          throw new Error(errorData.error || "File upload failed.")
        }
        const uploadResult = await uploadResponse.json()

        // Then, create the resource entry in the database with file metadata
        const createPayload = {
          title: submissionValues.title,
          type: submissionValues.type,
          description: submissionValues.description,
          moduleId: submissionValues.moduleId,
          submoduleId: submissionValues.submoduleId,
          fileUrl: uploadResult.resource.fileUrl,
          sizeBytes: uploadResult.resource.sizeBytes,
          sha256: uploadResult.resource.sha256,
          fileExt: uploadResult.resource.fileExt,
          mimeType: uploadResult.resource.mimeType,
        }

        response = await fetch("/api/resources", { // POST to create new resource
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Something went wrong.")
      }

      toast({
        title: initialData ? "Resource updated." : "Resource created.",
        description: initialData
          ? "Your resource has been updated." 
          : "Your new resource has been created.",
      })
      form.reset()
      onSuccess?.()
      router.push('/dashboard/resources'); // Navigate to dashboard/resources
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Resource Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {resourceTypeSchema.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Resource Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Field</FormLabel>
          <Select onValueChange={(value) => {
            setSelectedFieldId(value);
            setSelectedSemesterId(null);
            form.setValue('moduleId', '');
            form.setValue('submoduleId', '');
            onModuleChange?.(null);
          }} value={selectedFieldId ?? ''}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder="Select a field" /></SelectTrigger>
            </FormControl>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.id} value={field.id}>{field.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormItem>
          <FormLabel>Semester</FormLabel>
          <Select onValueChange={(value) => {
            setSelectedSemesterId(value);
            form.setValue('moduleId', '');
            form.setValue('submoduleId', '');
            onModuleChange?.(null);
          }} value={selectedSemesterId ?? ''} disabled={!selectedFieldId}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder="Select a semester" /></SelectTrigger>
            </FormControl>
            <SelectContent>
              {filteredSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>Semester {semester.number}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>

        <FormField
          control={form.control}
          name="moduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module</FormLabel>
              <Select onValueChange={(value) => {
                  field.onChange(value)
                  onModuleChange?.(value);
                  form.setValue('submoduleId', '');
                }} 
                value={field.value} 
                disabled={!selectedSemesterId}
              >
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a module" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredModules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>{module.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="submoduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submodule {submodules.length > 0 && <span className="text-red-500">*</span>}</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value ?? ''} 
                disabled={!form.getValues("moduleId") || submodules.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!form.getValues("moduleId") ? "Select a module first" : submodules.length === 0 ? "No submodules for this module" : "Select a submodule"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {submodules.map((submoduleItem) => (
                    <SelectItem key={submoduleItem.id} value={submoduleItem.id}>
                      {submoduleItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(event) => {
                    onChange(event.target.files && event.target.files[0]);
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Resource"}
        </Button>
      </form>
    </Form>
  )
}
