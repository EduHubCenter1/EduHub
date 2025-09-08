import { getAllFields } from "@/lib/data/all-fields";
import { getAllSemesters } from "@/lib/data/all-semesters";
import { getAllModules } from "@/lib/data/all-modules";
import { getAllSubmodules } from "@/lib/data/all-submodules";
import { UploadForm } from "@/components/admin/upload-form";

export default async function UploadPage() {
  const fields = await getAllFields();
  const semesters = await getAllSemesters();
  const modules = await getAllModules();
  const submodules = await getAllSubmodules();

  return (
    <UploadForm
      fields={fields}
      semesters={semesters}
      modules={modules}
      submodules={submodules}
    />
  );
}
