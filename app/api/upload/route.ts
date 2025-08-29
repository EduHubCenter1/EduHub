import { type NextRequest, NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import { storageService } from "@/lib/storage"
import { generateResourcePath } from "@/lib/utils"
import { uploadResourceSchema } from "@/lib/validators"
import crypto from "crypto"
import { createSupabaseServerClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/zip",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "text/plain",
  "text/csv",
]

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = user.user_metadata.role || ""

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const type = formData.get("type") as string
    const description = formData.get("description") as string
    const submoduleId = formData.get("submoduleId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate form data
    const validationResult = uploadResourceSchema.safeParse({
      title,
      type,
      description: description || undefined,
      submoduleId,
    })

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    // Get submodule with hierarchy for path generation and access control
    const submodule = await prisma.submodule.findUnique({
      where: { id: submoduleId },
      include: {
        module: {
          include: {
            semester: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    })

    if (!submodule) {
      return NextResponse.json({ error: "Submodule not found" }, { status: 404 })
    }

    // Check admin scope
    let hasAccess = false
    if (userRole === "superAdmin") {
      hasAccess = true
    } else {
      const adminScope = await prisma.adminScope.findFirst({
        where: {
          userId: user.id,
          fieldId: submodule.module.semester.field.id,
          semesterNumber: submodule.module.semester.number,
        },
      })
      hasAccess = !!adminScope
    }

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Generate file path
    const resourcePath = generateResourcePath(
      submodule.module.semester.field.slug,
      submodule.module.semester.number,
      submodule.module.slug,
      submodule.slug,
    )

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Calculate SHA256 hash
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex")

    // Check for duplicate files
    const existingResource = await prisma.resource.findFirst({
      where: { sha256 },
    })

    if (existingResource) {
      return NextResponse.json({ error: "File already exists in the system" }, { status: 409 })
    }

    // Save file to storage
    const fileUrl = await storageService.saveFile(buffer, file.name, resourcePath)

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || ""

    // Save resource metadata to database
    const resource = await prisma.resource.create({
      data: {
        title,
        type: type as any,
        description: description || null,
        fileUrl,
        fileExt,
        mimeType: file.type,
        sizeBytes: file.size,
        sha256,
        submoduleId,
        uploadedByUserId: user.id,
      },
    })

    return NextResponse.json({ success: true, resource })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
