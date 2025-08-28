import { type NextRequest, NextResponse } from "next/server"
import { searchService } from "@/lib/search"
import { searchSchema } from "@/lib/validators"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const fieldId = searchParams.get("fieldId")
    const semesterNumber = searchParams.get("semesterNumber")
    const type = searchParams.get("type")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Validate search parameters
    const validationResult = searchSchema.safeParse({
      q: query,
      fieldId: fieldId || undefined,
      semesterNumber: semesterNumber ? Number.parseInt(semesterNumber, 10) : undefined,
      type: type || undefined,
    })

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 })
    }

    const filters = {
      fieldId: fieldId || undefined,
      semesterNumber: semesterNumber ? Number.parseInt(semesterNumber, 10) : undefined,
      type: type || undefined,
    }

    const results = await searchService.search(query.trim(), filters)

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
