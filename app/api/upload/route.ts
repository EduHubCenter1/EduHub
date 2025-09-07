import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
// Removed: import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createServerClient } from "@supabase/ssr" // Added: createServerClient

import { prisma } from "@/lib/prisma"
import { storageService } from "@/lib/storage"
import { generateResourcePath, generatePendingResourcePath } from "@/lib/utils"
import { uploadResourceSchema } from "@/lib/validators"
import crypto from "crypto"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
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
    // Manually get the auth token from cookies
    const cookieStore = await cookies()
    
    // Initialize Supabase client with the token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) { // Use 'any' for options to avoid type issues
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    // Now get the user
    const { data: { user } } = await supabase.auth.getUser()
    console.log("API: User fetched:", user?.id);

    if (!user) {
      console.error("API: Unauthorized - No user found.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = user.user_metadata.role || ""
    console.log("API: User role:", userRole);

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const type = formData.get("type") as string
    const description = formData.get("description") as string
    const moduleId = formData.get("moduleId") as string
    const submoduleId = formData.get("submoduleId") as string | undefined
    console.log("API: Form data parsed. File:", file?.name, "Title:", title, "Type:", type);

    if (!file) {
      console.error("API: Upload Error: No file provided")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate form data
    const validationResult = uploadResourceSchema.safeParse({
      title,
      type,
      description: description || undefined,
      moduleId,
      submoduleId: submoduleId || undefined,
    })

    if (!validationResult.success) {
      console.error("API: Upload Error: Invalid form data", validationResult.error) // Log validation details
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }
    console.log("API: Form data validated successfully.");

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error(`API: Upload Error: File too large. Size: ${file.size} bytes, Max: ${MAX_FILE_SIZE} bytes`)
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })
    }
    console.log("API: File size validated.");

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error(`API: Upload Error: File type not allowed. Type: ${file.type}`)
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }
    console.log("API: File type validated.");

    let resourcePath;
    let fieldId;
    let semesterId;
    let moduleSlug;

    if (submoduleId) {
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
        console.error("API: Submodule not found for ID:", submoduleId);
        return NextResponse.json({ error: "Submodule not found" }, { status: 404 })
      }
      resourcePath = generatePendingResourcePath(
        submodule.module.semester.field.slug,
        submodule.module.semester.number,
        submodule.module.slug,
        submodule.slug,
      )
      fieldId = submodule.module.semester.field.id;
      semesterId = submodule.module.semester.id;
      moduleSlug = submodule.module.slug;
      console.log("API: Submodule path generated:", resourcePath);
    } else {
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
          semester: {
            include: {
              field: true,
            },
          },
        },
      });

      if (!module) {
        console.error("API: Module not found for ID:", moduleId);
        return NextResponse.json({ error: "Module not found" }, { status: 404 });
      }
      resourcePath = generatePendingResourcePath(
        module.semester.field.slug,
        module.semester.number,
        module.slug
      );
      fieldId = module.semester.field.id;
      semesterId = module.semester.id;
      moduleSlug = module.slug;
      console.log("API: Module path generated:", resourcePath);
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log("API: File converted to buffer.");

    // Calculate SHA256 hash
    const sha256 = crypto.createHash("sha256").update(buffer).digest("hex")
    console.log("API: SHA256 hash calculated:", sha256);

    // Check for duplicate files - TEMPORARILY DISABLED FOR TESTING
    /*
    const existingResource = await prisma.resource.findFirst({
      where: { sha256 },
    })

    if (existingResource) {
      return NextResponse.json({ error: "File already exists in the system" }, { status: 409 })
    }
    */

    // Save file to storage
    console.log("API: Attempting to save file to storage...");
    console.log("AZURE_STORAGE_ACCOUNT_NAME:", process.env.AZURE_STORAGE_ACCOUNT_NAME);
    console.log("AZURE_STORAGE_CONTAINER_NAME:", process.env.AZURE_STORAGE_CONTAINER_NAME);

    const azureStorageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const azureStorageContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

    if (!azureStorageAccountName || !azureStorageContainerName) {
      console.error("API: Azure Storage account name or container name not configured.");
      return NextResponse.json({ error: "Azure Storage account name or container name not configured." }, { status: 500 });
    }

    let blobName;
    try {
      blobName = await storageService.saveFile(buffer, file.name, resourcePath);
      console.log("API: File saved to storage. Blob Name:", blobName);
    } catch (storageError) {
      console.error("API: Error saving file to storage:", storageError);
      return NextResponse.json({ error: "Failed to save file to storage." }, { status: 500 });
    }
    
    const fileUrl = `https://${azureStorageAccountName}.blob.core.windows.net/${azureStorageContainerName}/${blobName}`;
    console.log("API: File URL generated:", fileUrl);

    // Get file extension
    const fileExt = file.name.split(".").pop()?.toLowerCase() || ""
    console.log("API: File extension:", fileExt);

    // Save resource metadata to database
    console.log("API: Attempting to save resource metadata to database...");
    let resource;
    try {
      resource = await prisma.resource.create({
        data: {
          title,
          type: type as any,
          description: description || null,
          fileUrl,
          fileExt,
          mimeType: file.type,
          sizeBytes: file.size,
          sha256,
          submoduleId: submoduleId || null,
          uploadedByUserId: user.id,
          moduleId: moduleId,
          status: 'pending', // Added status
        },
      })
      console.log("API: Resource metadata saved to database. Resource ID:", resource.id);
    } catch (dbError) {
      console.error("API: Error saving resource metadata to database:", dbError);
      return NextResponse.json({ error: "Failed to save resource metadata to database." }, { status: 500 });
    }

    return NextResponse.json({ success: true, resource })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error", details: error.message || String(error) }, { status: 500 })
  }
}