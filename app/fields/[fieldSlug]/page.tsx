import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SemestersGrid } from "@/components/public/semesters-grid";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { Metadata } from "next";

type Props = {
  params: { fieldSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const field = await prisma.fields.findUnique({
    where: { slug: params.fieldSlug },
  });

  if (!field) {
    return {
      title: "Field Not Found",
    };
  }

  return {
    title: field.name,
    description: `Browse semesters and modules for the ${field.name} field.`,
  };
}

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

    const breadcrumbItems = [
        { label: "Fields", href: "/fields" },
        { label: field.name, href: `/fields/${field.slug}` },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-6 mb-12 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl font-heading">
                    {field.name}
                </h1>
                {field.description && (
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {field.description}
                    </p>
                )}
            </div>
            
            <SemestersGrid fieldSlug={field.slug} semesters={field.semesters} />
        </div>
    );
}