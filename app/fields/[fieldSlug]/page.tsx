import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PublicLayout } from "@/components/public/public-layout"
import { SemestersGrid } from "@/components/public/semesters-grid"
import { Breadcrumbs } from "@/components/public/breadcrumbs"

interface PageProps {
  params: { fieldSlug: string }
}

async function getFieldWithSemesters(slug: string) {
  return await prisma.field.findUnique({
    where: { slug },
    include: {
      semesters: {
        orderBy: { number: "asc" },
        include: {
          _count: {
            select: {
              modules: true,
            },
          },
        },
      },
    },
  })
}

export default async function FieldPage({ params }: PageProps) {
  const field = await getFieldWithSemesters(params.fieldSlug)

  if (!field) {
    notFound()
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: field.name, href: `/fields/${field.slug}` },
  ]

  return (
    <PublicLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-heading text-primary">{field.name}</h1>
          {field.description && <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{field.description}</p>}
        </div>

        <SemestersGrid fieldSlug={field.slug} semesters={field.semesters} />
      </div>
    </PublicLayout>
  )
}
