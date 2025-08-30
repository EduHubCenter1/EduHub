import { getFields } from "@/lib/actions/fields.actions";
import { FieldsTableShell } from "@/components/admin/fields-table-shell";

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
