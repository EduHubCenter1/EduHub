import { z } from "zod"

export const semesterNumberSchema = z.number().int().min(1).max(6)

export const resourceTypeSchema = z.enum([
  "course",
  "exam",
  "tp_exercise",
  "project",
  "presentation",
  "report",
  "other",
])

export const userRoleSchema = z.enum(["superAdmin", "classAdmin"])

export const fieldFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
})

export const createModuleSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
  semesterId: z.string().cuid(),
  description: z.string().optional(),
})

export const createSubmoduleSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
  moduleId: z.string().cuid(),
  description: z.string().optional(),
})

export const uploadResourceSchema = z.object({
  title: z.string().min(1).max(255),
  type: resourceTypeSchema,
  description: z.string().optional(),
  moduleId: z.string().uuid(),
  submoduleId: z.string().uuid().optional(),
})

export const searchSchema = z.object({
  q: z.string().min(1),
  fieldId: z.string().cuid().optional(),
  semesterNumber: semesterNumberSchema.optional(),
  type: resourceTypeSchema.optional(),
  uploadedByUserId: z.string().uuid().optional(),
})

export const semesterFormSchema = z.object({
  number: semesterNumberSchema,
  fieldId: z.string().min(1).max(100),
})

export const moduleFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  semesterId: z.string().min(1).max(100)
})

export const submoduleFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  moduleId: z.string().min(1).max(100),
})

export const resourceStatusSchema = z.enum(["pending", "approved", "rejected"]); // New enum for resource status

export const resourceFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  type: resourceTypeSchema,
  description: z.string().optional(),
  moduleId: z.string().min(1, { message: "Module is required." }),
  submoduleId: z.string().optional(),
  file: z.any().optional(), // For file upload, handled separately
  status: resourceStatusSchema.optional(), // Added status field
  fileUrl: z.string().url().optional(),
  sizeBytes: z.number().int().optional(),
  sha256: z.string().optional(),
  fileExt: z.string().optional(),
  mimeType: z.string().optional(),
})
