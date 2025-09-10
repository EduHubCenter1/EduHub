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
import { toast } from "sonner"
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

import { useAuth } from "@/hooks/useAuth";

interface ResourceFormProps {
  initialData?: Resource
  onSuccess?: () => void
  onModuleChange?: (moduleId: string | null) => void
  submodules?: SubmoduleWithRelations[]
}

export function ResourceForm({ initialData, onSuccess, onModuleChange, submodules = [] }: ResourceFormProps) {
  const { 
    fields, 
    semesters, 
    modules, 
    submodules: allSubmodules 
  } = useGlobalData()
  const { user, supabase } = useAuth();
  const router = useRouter()

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedSemesterId, setSelectedSemesterId] = useState<string | null>(null);

  const isClassAdmin = user?.user_metadata?.role === 'classAdmin';

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
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("Not authenticated");
      }

      const authHeader = { Authorization: `Bearer ${token}` };

      const submissionValues = { ...values };

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
          response = await fetch("/api/upload", { method: "POST", body: formData, headers: authHeader })
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
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify(updatePayload),
        })

      } else {
        // Create new resource (requires a file)
        if (!values.file) {
          throw new Error("File is required for new resources.")
        }
        formData.append("file", values.file)

        response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          headers: authHeader,
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Something went wrong.")
      }

      toast.success(initialData ? "Resource updated." : "Resource created.", {
        description: initialData
          ? "Your resource has been updated." 
          : "Your new resource has been created.",
      })
      form.reset()
      onSuccess?.()
      router.push('/dashboard/resources'); // Navigate to dashboard/resources
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 grid grid-cols-2 gap-6 ">
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
              <FormLabel>Submodule</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                value={field.value ?? ''} 
                disabled={!form.getValues("moduleId")}
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
        <Button type="submit" disabled={isLoading} className={'col-span-2 mt-4'}>
          {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Resource"}
        </Button>
      </form>
    </Form>
  )
}
