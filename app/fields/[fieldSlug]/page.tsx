import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SemestersGrid } from "@/components/public/semesters-grid";

async function getFieldData(fieldSlug: string) {
    const field = await prisma.fields.findUnique({
        where: { slug: fieldSlug },
        include: {
            semesters: {
                orderBy: { number: "asc" },
                include: {
                    _count: {
                        select: { modules: true },
                    },
                },
            },
        },
    });

    if (!field) {
        notFound();
    }

    return field;
}

interface FieldPageProps {
    params: {
        fieldSlug: string;
    };
}

export default async function FieldPage({ params }: FieldPageProps) {
    const field = await getFieldData(params.fieldSlug);

    return (
        <div>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-heading">{field.name}</h1>
                {field.description && <p className="text-muted-foreground mt-2">{field.description}</p>}
            </div>
            <SemestersGrid fieldSlug={field.slug} semesters={field.semesters} />
        </div>
    );
}