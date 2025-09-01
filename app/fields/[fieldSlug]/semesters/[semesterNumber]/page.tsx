import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ModulesGrid } from "@/components/public/modules-grid";
import { Breadcrumbs } from "@/components/public/breadcrumbs";

async function getSemesterData(fieldSlug: string, semesterNumber: number) {
    const semester = await prisma.semester.findFirst({
        where: {
            number: semesterNumber,
            field: {
                slug: fieldSlug,
            },
        },
        include: {
            field: true,
            modules: {
                orderBy: { name: "asc" },
                include: {
                    _count: {
                        select: { resources: true, submodules: true },
                    },
                },
            },
        },
    });

    if (!semester) {
        notFound();
    }

    return semester;
}

interface SemesterPageProps {
    params: {
        fieldSlug: string;
        semesterNumber: string;
    };
}

export default async function SemesterPage({ params }: SemesterPageProps) {
    const semesterNumber = parseInt(params.semesterNumber, 10);
    const semester = await getSemesterData(params.fieldSlug, semesterNumber);

    return (
        <div>
             <Breadcrumbs
                items={[
                    { label: "Fields", href: "/" },
                    { label: semester.field.name, href: `/fields/${semester.field.slug}` },
                    { label: `Semester ${semester.number}`, href: `/fields/${semester.field.slug}/semesters/${semester.number}` },
                ]}
            />
            <div className="text-center my-8">
                <h1 className="text-3xl font-bold font-heading">Semester {semester.number}</h1>
                <p className="text-muted-foreground mt-2">Explore modules for this semester.</p>
            </div>
            <ModulesGrid fieldSlug={params.fieldSlug} semesterNumber={semesterNumber} modules={semester.modules} />
        </div>
    );
}