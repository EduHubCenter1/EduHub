"use client"

import { FieldsTableShell } from "@/components/admin/fields-table-shell";
import { useGlobalData } from "@/context/GlobalDataContext";

export default function FieldsPage() {
  const { fields } = useGlobalData();

  return (
    <div className={'px-6'}>
      <h1 className=" text-2xl font-bold">Fields</h1>
      <p>Manage your fields here.</p>
      <FieldsTableShell data={fields} />
    </div>
  );
}
