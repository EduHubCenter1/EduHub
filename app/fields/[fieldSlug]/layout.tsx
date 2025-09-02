
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public/public-header";
import { Breadcrumbs } from "@/components/public/breadcrumbs";
import { FieldResponsiveSidebar } from "@/components/public/field-responsive-sidebar";


async function getFieldData(fieldSlug: string) {
    const field = await prisma.fields.findUnique({
        where: { slug: fieldSlug },
        include: {
            semesters: {
                orderBy: { number: "asc" },
                include: {
                    modules: {
                        orderBy: { name: "asc" },
                        include: {
                            submodules: {
                                orderBy: { name: "asc" },
                            },
                        },
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


interface FieldLayoutProps {
    children: React.ReactNode;
    params: {
        fieldSlug: string;
    };
}

export default async function FieldLayout({ children, params: awaitedParams }: FieldLayoutProps) {
    const { fieldSlug } = await awaitedParams;
    const field = await getFieldData(fieldSlug);

    return (
        <div className="min-h-screen bg-background">
            {/*<PublicHeader />*/}
            <div className="flex flex-col lg:flex-row">
                <FieldResponsiveSidebar field={field} />
                <main className="p-6 flex-1">
                    <div className="max-w-6xl mx-auto">
                        
                        <div className="mt-4">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
