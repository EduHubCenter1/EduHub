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

export const createFieldSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(100),
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
  submoduleId: z.string().cuid(),
})

export const searchSchema = z.object({
  q: z.string().min(1),
  fieldId: z.string().cuid().optional(),
  semesterNumber: semesterNumberSchema.optional(),
  type: resourceTypeSchema.optional(),
})
