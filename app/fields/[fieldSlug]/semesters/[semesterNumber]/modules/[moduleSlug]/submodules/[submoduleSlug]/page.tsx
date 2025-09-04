import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { ResourcesPageClient } from "@/components/public/resources-page-client";

async function getSubmoduleData(fieldSlug: string, semesterNumber: number, moduleSlug: string, submoduleSlug: string) {
    const submodule = await prisma.submodule.findFirst({
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
                        select: { firstName: true, lastName: true },
                    },
                },
            },
        },
    });

    if (!submodule) {
        notFound();
    }
    
    const formattedResources = submodule.resources.map(r => ({
        ...r,
        uploadedBy: {
            name: `${r.uploadedBy?.firstName || ''} ${r.uploadedBy?.lastName || ''}`.trim(),
        },
    }));

    return { ...submodule, resources: formattedResources };
}

interface SubmodulePageProps {
    params: {
        fieldSlug: string;
        semesterNumber: string;
        moduleSlug: string;
        submoduleSlug: string;
    };
}

export default async function SubmodulePage({ params: awaitedParams }: SubmodulePageProps) {
    const params = await awaitedParams;
    const semesterNumber = parseInt(params.semesterNumber, 10);
    const submodule = await getSubmoduleData(params.fieldSlug, semesterNumber, params.moduleSlug, params.submoduleSlug);
    const { module } = submodule;
    const { semester } = module;
    const { field } = semester;

    return (
        <div>
            <Breadcrumbs
                items={[
                    { label: "Fields", href: "/" },
                    { label: field.name, href: `/fields/${field.slug}` },
                    { label: `Semester ${semester.number}`, href: `/fields/${field.slug}/semesters/${semester.number}` },
                    { label: module.name, href: `/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}` },
                    { label: submodule.name, href: `/fields/${field.slug}/semesters/${semester.number}/modules/${module.slug}/submodules/${submodule.slug}` },
                ]}
            />
            <ResourcesPageClient 
                resources={submodule.resources} 
                title={submodule.name}
                description={submodule.description}
            />
        </div>
    );
}