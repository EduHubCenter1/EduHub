import { getServerSession } from "next-auth"
import { authOptions } from "./auth-config"
import { prisma } from "./prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireSuperAdmin() {
  const user = await requireAuth()
  if (user.role !== "superAdmin") {
    throw new Error("Forbidden: Super admin required")
  }
  return user
}

export async function checkAdminScope(userId: string, fieldId: string, semesterNumber: number): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { adminScopes: true },
  })

  if (!user) return false
  if (user.role === "superAdmin") return true

  return user.adminScopes.some((scope) => scope.fieldId === fieldId && scope.semesterNumber === semesterNumber)
}
