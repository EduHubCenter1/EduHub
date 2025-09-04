import { prisma } from "@/lib/prisma";
import { CenteredFieldsPage } from "@/components/public/centered-fields-page";

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

    return <CenteredFieldsPage fields={fields} />;
}
