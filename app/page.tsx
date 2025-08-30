import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { HeroSection } from "@/components/public/hero-section"
import { FieldsGrid } from "@/components/public/fields-grid"
import { PublicHeader } from "@/components/public/public-header"
import { SearchBar } from "@/components/public/search-bar"

async function getFields() {
  try {
    return await prisma.fields.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            semesters: true,
          },
        },
      },
    })
  } catch (error) {
    console.error("Failed to fetch fields during build:", error);
    return [];
  }
}

export default async function HomePage() {
  const fields = await getFields()

  return (
    <div className="min-h-screen bg-background">
      
      <main>
        <HeroSection />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Suspense fallback={<div>Loading search...</div>}>
              <SearchBar />
            </Suspense>
          </div>
          <FieldsGrid fields={fields} />
        </div>
      </main>
    </div>
  )
}
