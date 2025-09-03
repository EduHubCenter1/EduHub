"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { submodule as Submodule } from "@prisma/client"

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
import { submoduleFormSchema } from "@/lib/validators"
import { useGlobalData } from "@/context/GlobalDataContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface SubmoduleFormProps {
  initialData?: Submodule // For editing existing submodule
  onSuccess?: () => void
}

export function SubmoduleForm({ initialData, onSuccess }: SubmoduleFormProps) {
  const { modules, refetchModules } = useGlobalData()
  const router = useRouter()

  const form = useForm<z.infer<typeof submoduleFormSchema>>({
    resolver: zodResolver(submoduleFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      moduleId: initialData?.moduleId || undefined,
    },
    shouldUnregister: true,
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof submoduleFormSchema>) {
    try {
      let response
      if (initialData) {
        // Update existing submodule
        response = await fetch(`/api/submodules/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
      } else {
        // Create new submodule
        response = await fetch("/api/submodules", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Something went wrong.")
      }

      toast.success(initialData ? "Submodule updated." : "Submodule created.", {
        description: initialData
          ? "Your submodule has been updated." 
          : "Your new submodule has been created.",
      })
      form.reset()
      onSuccess?.()
      router.refresh() // Refresh the current route to re-fetch data
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "An unexpected error occurred.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submodule Name</FormLabel>
              <FormControl>
                <Input placeholder="Submodule Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="moduleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {modules.map((moduleItem) => (
                    <SelectItem key={moduleItem.id} value={moduleItem.id}>
                      {moduleItem.name} (Semester {moduleItem.semester.number} - {moduleItem.semester.field.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Submodule"}
        </Button>
      </form>
    </Form>
  )
}
