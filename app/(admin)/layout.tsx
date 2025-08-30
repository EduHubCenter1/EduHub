import AdminLayout from "@/components/admin/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import * as React from "react";
import { GlobalDataProvider } from "../../context/GlobalDataContext";
import { fields } from "@prisma/client";

async function getFields(): Promise<fields[]> {
  const res = await fetch("http://localhost:3000/api/fields", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch fields");
  }
  return res.json();
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const initialFields = await getFields();

  return (
    <SidebarProvider>
      <GlobalDataProvider initialFields={initialFields}>
        <AdminLayout>
            <SiteHeader/>
            {children}
        </AdminLayout>
      </GlobalDataProvider>
    </SidebarProvider>
  );
}