import AdminLayout from "@/components/admin/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import * as React from "react";
import { GlobalDataProvider } from "../../context/GlobalDataContext";
import { fields} from "@prisma/client";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getFieldsForUser } from "@/lib/data/fields";

// Helper to construct absolute URLs
const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
};

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

async function getSemesters(accessToken?: string): Promise<SemesterWithField[]> {
  const res = await fetch(`${getBaseUrl()}/api/semesters`, {
    cache: "no-store",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch semesters");
  }
  return res.json();
}

async function getModules(accessToken?: string): Promise<ModuleWithSemesterAndField[]> {
  const res = await fetch(`${getBaseUrl()}/api/modules`, {
    cache: "no-store",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch modules");
  }
  return res.json();
}

async function getSubmodules(accessToken?: string): Promise<SubmoduleWithModuleSemesterAndField[]> {
  const res = await fetch(`${getBaseUrl()}/api/submodules`, {
    cache: "no-store",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch submodules");
  }
  return res.json();
}

async function getResources(accessToken?: string): Promise<ResourceWithSubmoduleModuleSemesterAndField[]> {
  const res = await fetch(`${getBaseUrl()}/api/resources`, {
    cache: "no-store",
    headers: {
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch resources");
  }
  return res.json();
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

  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  const accessToken = session?.access_token;

  const initialFields = await getFieldsForUser(user);
  const initialSemesters = await getSemesters(accessToken);
  const initialModules = await getModules(accessToken);
  const initialSubmodules = await getSubmodules(accessToken);
  const initialResources = await getResources(accessToken);

  return (
    <SidebarProvider>
      <GlobalDataProvider initialFields={initialFields} initialSemesters={initialSemesters} initialModules={initialModules} initialSubmodules={initialSubmodules} initialResources={initialResources}>
        <AdminLayout>
            <SiteHeader/>
            {children}
        </AdminLayout>
      </GlobalDataProvider>
    </SidebarProvider>
  );
}
