import { type NextRequest, NextResponse } from "next/server"
import { searchService } from "@/lib/search"
import { searchSchema } from "@/lib/validators"
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const fieldId = searchParams.get("fieldId")
    const semesterNumber = searchParams.get("semesterNumber")
    const type = searchParams.get("type")
    const uploadedByUserId = searchParams.get("uploadedByUserId")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Validate search parameters
    const validationResult = searchSchema.safeParse({
      q: query,
      fieldId: fieldId || undefined,
      semesterNumber: semesterNumber ? Number.parseInt(semesterNumber, 10) : undefined,
      type: type || undefined,
      uploadedByUserId: uploadedByUserId || undefined,
    })

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 })
    }

    const filters = {
      fieldId: fieldId || undefined,
      semesterNumber: semesterNumber ? Number.parseInt(semesterNumber, 10) : undefined,
      type: type || undefined,
      uploadedByUserId: uploadedByUserId || undefined,
    }

    const results = await searchService.search(query.trim(), filters)

    // --- Start of Analytics Logging ---
    try {
        const visitorId = request.headers.get('x-visitor-id');
        if (visitorId) {
            await prisma.searchLog.create({
                data: {
                    visitorId: visitorId,
                    query: query.trim(),
                    resultsCount: results.length,
                },
            });
        }
    } catch (error) {
        // Non-critical error, log for debugging
        console.error('[ANALYTICS_ERROR] Failed to log search event:', error);
    }
    // --- End of Analytics Logging ---

    return NextResponse.json({
      query: query.trim(),
      filters,
      results,
      total: results.length,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
