"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { module as Module } from "@prisma/client"

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
import { moduleFormSchema } from "@/lib/validators"
import { useGlobalData } from "@/context/GlobalDataContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface ModuleFormProps {
  initialData?: Module // For editing existing module
  onSuccess?: () => void
}

export function ModuleForm({ initialData, onSuccess }: ModuleFormProps) {
  const { toast } = useToast()
  const { semesters, refetchSemesters } = useGlobalData()
  const router = useRouter()

  const form = useForm<z.infer<typeof moduleFormSchema>>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      semesterId: initialData?.semesterId || undefined,
    },
    shouldUnregister: true,
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof moduleFormSchema>) {
    try {
      let response
      if (initialData) {
        // Update existing module
        response = await fetch(`/api/modules/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
      } else {
        // Create new module
        response = await fetch("/api/modules", {
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

      toast({
        title: initialData ? "Module updated." : "Module created.",
        description: initialData
          ? "Your module has been updated." 
          : "Your new module has been created.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Name</FormLabel>
              <FormControl>
                <Input placeholder="Module Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semesterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {semesters.map((semesterItem) => (
                    <SelectItem key={semesterItem.id} value={semesterItem.id}>
                      Semester {semesterItem.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Module"}
        </Button>
      </form>
    </Form>
  )
}
