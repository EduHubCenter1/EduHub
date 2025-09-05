import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { SubmodulesGrid } from "@/components/public/submodules-grid";
import { ResourcesGrid } from "@/components/public/resources-grid";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { fieldSlug: string; semesterNumber: string; moduleSlug: string } }): Promise<Metadata> {
  // @ts-ignore
  const { fieldSlug, semesterNumber: semesterNumberStr, moduleSlug } = await params;
  const semesterNumber = parseInt(semesterNumberStr, 10);
  const module = await prisma.module.findFirst({
    where: {
      slug: moduleSlug,
      semester: {
        number: semesterNumber,
        field: {
          slug: fieldSlug,
        },
      },
    },
    include: {
      semester: {
        include: {
          field: true,
        },
      },
    },
  });

  if (!module) {
    return {
      title: "Module Not Found",
    };
  }

  return {
    title: `${module.name} - ${module.semester.field.name}`,
    description: `Browse resources for the ${module.name} module in Semester ${module.semester.number} of the ${module.semester.field.name} field.`,
  };
}

async function getModuleData(fieldSlug: string, semesterNumber: number, moduleSlug: string) {
    const module = await prisma.module.findFirst({
        where: {
            slug: moduleSlug,
            semester: {
                number: semesterNumber,
                field: {
                    slug: fieldSlug,
                },
            },
        },
        include: {
            semester: {
                include: {
                    field: true,
                },
            },
            submodules: {
                orderBy: { name: "asc" },
                include: {
                    _count: {
                        select: { resources: true },
                    },
                },
            },
            resources: {
                where: { submoduleId: null }, // Only resources directly under the module
                orderBy: { createdAt: "desc" },
                include: {
                    uploadedBy: {
                        select: { firstName: true, lastName: true },
                    },
                },
            },
        },
    });

    if (!module) {
        notFound();
    }

    // Manually map to match ResourceCard expectations
    const formattedResources = module.resources.map(r => ({
        ...r,
        uploadedBy: {
            name: `${r.uploadedBy?.firstName || ''} ${r.uploadedBy?.lastName || ''}`.trim(),
        },
    }));


    return { ...module, resources: formattedResources };
}

interface ModulePageProps {
    params: {
        fieldSlug: string;
        semesterNumber: string;
        moduleSlug: string;
    };
}

export default async function ModulePage({ params }: ModulePageProps) {
    // @ts-ignore
    const { fieldSlug, semesterNumber: semesterNumberStr, moduleSlug } = await params;
    const semesterNumber = parseInt(semesterNumberStr, 10);
    const module = await getModuleData(fieldSlug, semesterNumber, moduleSlug);
    const { field } = module.semester;

    const hasSubmodules = module.submodules.length > 0;

    return (
        <div>
            <Breadcrumbs
                items={[
                    { label: "Fields", href: "/fields" },
                    { label: field.name, href: `/fields/${field.slug}` },
                    { label: `Semester ${semesterNumber}`, href: `/fields/${field.slug}/semesters/${semesterNumber}` },
                    { label: module.name, href: `/fields/${field.slug}/semesters/${semesterNumber}/modules/${module.slug}` },
                ]}
            />
            <div className="text-center my-8">
                <h1 className="text-3xl font-bold font-heading">{module.name}</h1>
                {module.description && <p className="text-muted-foreground mt-2">{module.description}</p>}
            </div>

            {hasSubmodules ? (
                <SubmodulesGrid
                    fieldSlug={field.slug}
                    semesterNumber={semesterNumber}
                    moduleSlug={module.slug}
                    submodules={module.submodules}
                />
            ) : (
                <ResourcesGrid resources={module.resources} />
            )}
        </div>
    );
}