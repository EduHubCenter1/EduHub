import AdminLayout from "@/components/admin/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import * as React from "react";
import { GlobalDataProvider } from "../../context/GlobalDataContext";
import { fields } from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getFieldsForUser } from "@/lib/data/fields";
import { getSemestersForUser } from "@/lib/data/semesters";
import { getModulesForUser } from "@/lib/data/modules";
import { getSubmodulesForUser } from "@/lib/data/submodules";
import { getResourcesForUser } from "@/lib/data/resources";

interface SemesterWithField extends Semester {
  field: Pick<fields, "name">
}

interface ModuleWithSemesterAndField extends Module {
  semester: Pick<Semester, "number"> & {
    field: Pick<fields, "name">
  }
}

interface SubmoduleWithModuleSemesterAndField extends Submodule {
  module: Pick<Module, "name"> & {
    semester: Pick<Semester, "number"> & {
      field: Pick<fields, "name">
    }
  }
}

interface ResourceWithSubmoduleModuleSemesterAndField extends Resource {
  submodule: (Pick<Submodule, "name"> & {
    module: Pick<Module, "name"> & {
      semester: Pick<Semester, "number"> & {
        field: Pick<fields, "name">
      }
    }
  }) | null
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
        set: (name: string, value: string, options: any) => cookies().set(name, value, options),
        remove: (name: string, value: string, options: any) => cookies().set(name, '', options),
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const [
    initialFields,
    initialSemesters,
    initialModules,
    initialSubmodules,
    initialResources
  ] = await Promise.all([
    getFieldsForUser(user),
    getSemestersForUser(user),
    getModulesForUser(user),
    getSubmodulesForUser(user),
    getResourcesForUser(user)
  ]);

  return (
    <SidebarProvider>
      <GlobalDataProvider 
        initialFields={initialFields} 
        initialSemesters={initialSemesters} 
        initialModules={initialModules} 
        initialSubmodules={initialSubmodules} 
        initialResources={initialResources}
      >
        <AdminLayout>
            <SiteHeader/>
            {children}
        </AdminLayout>
      </GlobalDataProvider>
    </SidebarProvider>
  );
}