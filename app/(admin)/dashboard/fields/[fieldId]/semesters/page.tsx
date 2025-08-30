import { semesters as Semester } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { FieldsDataTable } from "@/components/admin/fields-data-table"; // Reusing for now, will create specific if needed

interface SemestersPageProps {
  params: {
    fieldId: string;
  };
}

async function getSemestersByFieldId(fieldId: string): Promise<Semester[]> {
  // TODO: use a dynamic host
  const res = await fetch(`http://localhost:3000/api/fields/${fieldId}/semesters`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch semesters");
  }
  return res.json();
}

export default async function SemestersPage({ params }: SemestersPageProps) {
  const { fieldId } = params;
  const semesters = await getSemestersByFieldId(fieldId);

  const columns: ColumnDef<Semester>[] = [
    { accessorKey: "number", header: "Semester Number" },
    { accessorKey: "createdAt", header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div className="font-medium">{date.toLocaleDateString()}</div>
      },
    },
    // Add more columns as needed
  ];

  return (
    <div className={'px-6'}>
      <h1 className=" text-2xl font-bold">Semesters for Field ID: {fieldId}</h1>
      <p>Manage semesters here.</p>
      <FieldsDataTable columns={columns} data={semesters} />
    </div>
  );
}
