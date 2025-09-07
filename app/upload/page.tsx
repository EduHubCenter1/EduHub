import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSemestersForUser } from "@/lib/data/semesters";
import { getModulesForUser } from "@/lib/data/modules";
import { getSubmodulesForUser } from "@/lib/data/submodules"; // Assuming this function exists
import { UploadForm } from "@/components/admin/upload-form";

export default async function UploadPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const semesters = await getSemestersForUser(user);
  const modules = await getModulesForUser(user);
  const submodules = await getSubmodulesForUser(user); // Fetch submodules

  return (
    <UploadForm
      semesters={semesters}
      modules={modules}
      submodules={submodules}
    />
  );
}