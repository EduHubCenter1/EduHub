import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { promises as fs } from "fs"
import path from "path"

interface RouteParams {
  params: { resourceId: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { resourceId } = params

    // Get resource from database
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        submodule: {
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
        },
      },
    })

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Get file path
    const filePath = path.join(process.env.UPLOADS_DIR || "./uploads", resource.fileUrl)

    try {
      // Check if file exists
      await fs.access(filePath)
    } catch {
      return NextResponse.json({ error: "File not found on disk" }, { status: 404 })
    }

    // Read file
    const fileBuffer = await fs.readFile(filePath)

    // Set appropriate headers
    const headers = new Headers()
    headers.set("Content-Type", resource.mimeType)
    headers.set("Content-Length", resource.sizeBytes.toString())
    headers.set("Content-Disposition", `attachment; filename="${resource.title}.${resource.fileExt}"`)

    // Handle range requests for video streaming
    const range = request.headers.get("range")
    if (range && resource.mimeType.startsWith("video/")) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = Number.parseInt(parts[0], 10)
      const end = parts[1] ? Number.parseInt(parts[1], 10) : resource.sizeBytes - 1
      const chunksize = end - start + 1

      headers.set("Content-Range", `bytes ${start}-${end}/${resource.sizeBytes}`)
      headers.set("Accept-Ranges", "bytes")
      headers.set("Content-Length", chunksize.toString())

      const chunk = fileBuffer.slice(start, end + 1)
      return new NextResponse(chunk, { status: 206, headers })
    }

    return new NextResponse(fileBuffer, { headers })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
