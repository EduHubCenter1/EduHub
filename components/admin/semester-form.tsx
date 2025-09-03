"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { semester } from "@prisma/client"

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
import { semesterFormSchema } from "@/lib/validators"
import { useGlobalData } from "@/context/GlobalDataContext"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface SemesterFormProps {
  initialData?: semester // For editing existing semester
  onSuccess?: () => void
}

export function SemesterForm({ initialData, onSuccess }: SemesterFormProps) {
  const { fields, refetchFields } = useGlobalData()
  const router = useRouter()

  const form = useForm<z.infer<typeof semesterFormSchema>>({
    resolver: zodResolver(semesterFormSchema),
    defaultValues: {
      number: initialData?.number || 1,
      fieldId: initialData?.fieldId || undefined,
    },
    shouldUnregister: true,
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof semesterFormSchema>) {
    try {
      let response
      if (initialData) {
        // Update existing semester
        response = await fetch(`/api/semesters/${initialData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        })
      } else {
        // Create new semester
        response = await fetch("/api/semesters", {
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

      toast.success(initialData ? "Semester updated." : "Semester created.", {
        description: initialData
          ? "Your semester has been updated." 
          : "Your new semester has been created.",
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
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester Number</FormLabel>
              <FormControl>
                <Input
                    type="number"
                    min={1}
                    {...field}
                    onChange={event => {
                      const value = event.target.value;
                      field.onChange(value === "" ? "" : parseInt(value));
                    }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fieldId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fields.map((fieldItem) => (
                    <SelectItem key={fieldItem.id} value={fieldItem.id}>
                      {fieldItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData ? "Save Changes" : "Create Semester"}
        </Button>
      </form>
    </Form>
  )
}
