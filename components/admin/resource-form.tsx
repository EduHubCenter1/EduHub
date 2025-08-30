"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { resource as Resource } from "@prisma/client"

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

interface ResourceFormProps {
  initialData?: Resource // For editing existing resource
  onSuccess?: () => void
}

export function ResourceForm({ initialData, onSuccess }: ResourceFormProps) {
  const { toast } = useToast()
  const { submodules, refetchSubmodules } = useGlobalData()
  const router = useRouter()

  const form = useForm<z.infer<typeof resourceFormSchema>>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || undefined,
      description: initialData?.description || "",
      submoduleId: initialData?.submoduleId || undefined,
    },
    shouldUnregister: true,
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof resourceFormSchema>) {
    try {
      let response
      const formData = new FormData()

      // Append metadata fields
      formData.append("title", values.title)
      formData.append("type", values.type)
      formData.append("description", values.description || "")
      formData.append("submoduleId", values.submoduleId)

      if (initialData) {
        // Update existing resource
        // If a new file is selected, upload it first
        if (values.file) {
          formData.append("file", values.file)
          // Call the upload API to handle file and get new metadata
          response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })
          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || "File upload failed.")
          }
          const uploadResult = await response.json()
          // Now update the resource metadata with new file info
          response = await fetch(`/api/resources/${initialData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              type: values.type,
              description: values.description,
              submoduleId: values.submoduleId,
              fileUrl: uploadResult.resource.fileUrl, // Use new fileUrl from upload
              sizeBytes: uploadResult.resource.sizeBytes,
              sha256: uploadResult.resource.sha256,
              fileExt: uploadResult.resource.fileExt,
              mimeType: uploadResult.resource.mimeType,
            }),
          })
        } else {
          // No new file, just update metadata
          response = await fetch(`/api/resources/${initialData.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              type: values.type,
              description: values.description,
              submoduleId: values.submoduleId,
            }),
          })
        }
      } else {
        // Create new resource (requires a file)
        if (!values.file) {
          throw new Error("File is required for new resources.")
        }
        formData.append("file", values.file)
        response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
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
      router.refresh() // Refresh the current route to re-fetch data
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
        <FormField
          control={form.control}
          name="submoduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submodule</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a submodule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {submodules.map((submoduleItem) => (
                    <SelectItem key={submoduleItem.id} value={submoduleItem.id}>
                      {submoduleItem.name} (M: {submoduleItem.module.name} | S: {submoduleItem.module.semester.number} | F: {submoduleItem.module.semester.field.name})
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
