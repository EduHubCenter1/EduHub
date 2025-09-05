import { Suspense } from "react"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { searchService } from "@/lib/search"
import { PublicLayout } from "@/components/public/public-layout"
import { SearchResults } from "@/components/public/search-results"
import { SearchFilters } from "@/components/public/search-filters"
import { Breadcrumbs } from "@/components/public/breadcrumbs"
import { Metadata } from "next";

interface SearchPageProps {
  searchParams: {
    q?: string
    fieldId?: string
    semesterNumber?: string
    type?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q?.trim()

  if (!query) {
    return {
      title: "Search",
    };
  }

  return {
    title: `Search results for "${query}"`,
  };
}

async function getSearchData(query: string, filters: any) {
  const [results, fields] = await Promise.all([
    searchService.search(query, filters),
    prisma.fields.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ])

  return { results, fields }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim()

  if (!query) {
    notFound()
  }

  const filters = {
    fieldId: searchParams.fieldId || undefined,
    semesterNumber: searchParams.semesterNumber ? Number.parseInt(searchParams.semesterNumber, 10) : undefined,
    type: searchParams.type || undefined,
  }

  const { results, fields } = await getSearchData(query, filters)

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: `Search: "${query}"`, href: `/search?q=${encodeURIComponent(query)}` },
  ]

  return (
    <PublicLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold font-heading">Search Results</h1>
          <p className="text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters fields={fields} currentFilters={filters} query={query} />
            </Suspense>
          </div>

          <div className="lg:col-span-3">
            <SearchResults results={results} query={query} />
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}