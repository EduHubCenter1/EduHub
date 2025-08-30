import { fields } from "@prisma/client";
import { FieldsTableShell } from "@/components/admin/fields-table-shell";


async function getFields(): Promise<fields[]> {
  const res = await fetch("http://localhost:3000/api/fields", { cache: "no-store" })
  if (!res.ok) {
    throw new Error("Failed to fetch fields")
  }
  return res.json()
}

export default async function FieldsPage() {
  const fields = await getFields();

  return (
    <div className={'px-6'}>
      <h1 className=" text-2xl font-bold">Fields</h1>
      <p>Manage your fields here.</p>
      <FieldsTableShell data={fields} />
    </div>
  );
}
