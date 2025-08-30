"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Field } from "@prisma/client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { fieldFormSchema } from "@/lib/validators"
import { upsertField } from "@/lib/actions/fields.actions"

interface FieldFormProps {
  field?: Field
  onSubmitSuccess?: () => void
}

export function FieldForm({ field, onSubmitSuccess }: FieldFormProps) {
  const form = useForm<z.infer<typeof fieldFormSchema>>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      name: field?.name || "",
      description: field?.description || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof fieldFormSchema>) => {
    const response = await upsertField({ ...values, id: field?.id })

    if (response.message) {
      toast.error(response.message)
    } else {
      toast.success(`Field ${field ? "updated" : "created"} successfully`)
      onSubmitSuccess?.()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineering" {...field} />
              </FormControl>
              <FormDescription>The name of the field.</FormDescription>
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
                <Textarea
                  placeholder="A brief description of the field."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}
