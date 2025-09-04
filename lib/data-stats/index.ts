import { prisma } from "@/lib/prisma"

export const getTotalUsers = async () => {
  const users = await prisma.users.count()
  return users
}

export const getTotalSuperAdmins = async () => {
  const users = await prisma.users.count({
    where: {
      raw_user_meta_data: {
        path: ["role"],
        equals: "superAdmin",
      },
    },
  })
  return users
}

export const getTotalClassAdmins = async () => {
  const users = await prisma.users.count({
    where: {
      raw_user_meta_data: {
        path: ["role"],
        equals: "classAdmin",
      },
    },
  })
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

export const getResourceUploadsOverTime = async () => {
  const result: { date: Date; uploads: bigint }[] = await prisma.$queryRaw`
    SELECT DATE_TRUNC('day', "created_at") as date, COUNT(*)::bigint as uploads
    FROM "public"."resources"
    GROUP BY DATE_TRUNC('day', "created_at")
    ORDER BY date ASC
  `;

  return result.map(item => ({
    date: item.date.toISOString().split('T')[0],
    uploads: Number(item.uploads),
  }));
}