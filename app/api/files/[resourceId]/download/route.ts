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

    // --- Start of Analytics Logging ---
    try {
        const visitorId = request.headers.get('x-visitor-id');
        if (visitorId) {
            await prisma.downloadLog.create({
                data: {
                    visitorId: visitorId,
                    resourceId: resourceId,
                },
            });
        }
    } catch (error) {
        // Non-critical error, log for debugging
        console.error('[ANALYTICS_ERROR] Failed to log download event:', error);
    }
    // --- End of Analytics Logging ---

    // Redirect to the Azure Blob Storage URL
    return NextResponse.redirect(resource.fileUrl)
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
