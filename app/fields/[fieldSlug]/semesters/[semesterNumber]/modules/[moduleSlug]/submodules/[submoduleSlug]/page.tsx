import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PublicLayout } from "@/components/public/public-layout"
import { ResourcesGrid } from "@/components/public/resources-grid"
import { Breadcrumbs } from "@/components/public/breadcrumbs"

interface PageProps {
  params: {
    fieldSlug: string
    semesterNumber: string
    moduleSlug: string
    submoduleSlug: string
  }
}

async function getSubmoduleWithResources(
  fieldSlug: string,
  semesterNumber: number,
  moduleSlug: string,
  submoduleSlug: string,
) {
  return await prisma.submodule.findFirst({
    where: {
      slug: submoduleSlug,
      module: {
        slug: moduleSlug,
        semester: {
          number: semesterNumber,
          field: {
            slug: fieldSlug,
          },
        },
      },
    },
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
      resources: {
        orderBy: { createdAt: "desc" },
        include: {
          uploadedBy: {
            select: { name: true },
          },
        },
      },
    },
  })
}

export default async function SubmodulePage({ params }: PageProps) {
  const semesterNumber = Number.parseInt(params.semesterNumber, 10)

  if (isNaN(semesterNumber) || semesterNumber < 1 || semesterNumber > 6) {
    notFound()
  }

  const submodule = await getSubmoduleWithResources(
    params.fieldSlug,
    semesterNumber,
    params.moduleSlug,
    params.submoduleSlug,
  )

  if (!submodule) {
    notFound()
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: submodule.module.semester.field.name, href: `/fields/${params.fieldSlug}` },
    {
      label: `Semester ${semesterNumber}`,
      href: `/fields/${params.fieldSlug}/semesters/${semesterNumber}`,
    },
    {
      label: submodule.module.name,
      href: `/fields/${params.fieldSlug}/semesters/${semesterNumber}/modules/${params.moduleSlug}`,
    },
    {
      label: submodule.name,
      href: `/fields/${params.fieldSlug}/semesters/${semesterNumber}/modules/${params.moduleSlug}/submodules/${params.submoduleSlug}`,
    },
  ]

  return (
    <PublicLayout>
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-heading text-primary">{submodule.name}</h1>
          {submodule.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{submodule.description}</p>
          )}
          <div className="text-sm text-muted-foreground">
            <p>
              {submodule.module.semester.field.name} • Semester {submodule.module.semester.number} •{" "}
              {submodule.module.name}
            </p>
          </div>
        </div>

        <ResourcesGrid
          resources={submodule.resources}
          title="Resources"
          description="Download files and materials for this submodule"
        />
      </div>
    </PublicLayout>
  )
}
