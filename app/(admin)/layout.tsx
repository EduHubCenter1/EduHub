import AdminLayout from "@/components/admin/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import * as React from "react";
import { GlobalDataProvider } from "../../context/GlobalDataContext";
import { fields, semester, module as Module, submodule as Submodule, resource as Resource } from "@prisma/client";

interface SemesterWithField extends semester {
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

async function getFields(): Promise<fields[]> {
  const res = await fetch("http://localhost:3000/api/fields", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch fields");
  }
  return res.json();
}

async function getSemesters(): Promise<SemesterWithField[]> {
  const res = await fetch("http://localhost:3000/api/semesters", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch semesters");
  }
  return res.json();
}

async function getModules(): Promise<ModuleWithSemesterAndField[]> {
  const res = await fetch("http://localhost:3000/api/modules", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch modules");
  }
  return res.json();
}

async function getSubmodules(): Promise<SubmoduleWithModuleSemesterAndField[]> {
  const res = await fetch("http://localhost:3000/api/submodules", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch submodules");
  }
  return res.json();
}

async function getResources(): Promise<ResourceWithSubmoduleModuleSemesterAndField[]> {
  const res = await fetch("http://localhost:3000/api/resources", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch resources");
  }
  return res.json();
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const initialFields = await getFields();
  const initialSemesters = await getSemesters();
  const initialModules = await getModules();
  const initialSubmodules = await getSubmodules();
  const initialResources = await getResources();

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