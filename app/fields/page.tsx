import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InspiredByGi } from "@/components/public/inspired-by-gi";

export const metadata: Metadata = {
    title: "All Fields",
};

async function getFieldsData() {
    const fields = await prisma.fields.findMany({
        include: {
            _count: {
                select: { semesters: true },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
    return fields;
}

export default async function FieldsPage() {
    const fields = await getFieldsData();

    return <InspiredByGi fields={fields} />;
}