import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface RouteParams {
  params: { resourceId: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { resourceId } = await params

    // Get resource from database
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { fileUrl: true }, // Only fetch the fileUrl
    })

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Redirect to the Azure Blob Storage URL
    return NextResponse.redirect(resource.fileUrl)
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
