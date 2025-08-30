import AdminLayout from "@/components/admin/admin-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import {SiteHeader} from "@/components/site-header";
import * as React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>

      <AdminLayout>
          <SiteHeader/>
          {children}
      </AdminLayout>
    </SidebarProvider>
  );
}