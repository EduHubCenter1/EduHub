import { prisma } from "@/lib/prisma"

export const getTotalUsers = async () => {
  const users = await prisma.user.count()
  return users
}

export const getTotalFields = async () => {
  const fields = await prisma.fields.count()
  return fields
}

export const getTotalModules = async () => {
  const modules = await prisma.module.count()
  return modules
}

export const getTotalResources = async () => {
  const resources = await prisma.resource.count()
  return resources
}
