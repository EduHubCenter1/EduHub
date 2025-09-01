'use client'
import * as React from "react"
import {
    ArrowUpCircleIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FolderIcon, GraduationCap,
    LayoutDashboardIcon,
    ListIcon,
    UserPlusIcon,
    UsersIcon,
} from "lucide-react"

import { AdminNav } from "@/components/admin/admin-nav"
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger,
} from "@/components/ui/sidebar"
import {NavMain} from "@/components/nav-main";
import {SiteHeader} from "@/components/site-header";

const navMain = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UsersIcon,
    },
    // {
    //   title: "Create User",
    //   url: "/dashboard/create-user",
    //   icon: UserPlusIcon,
    // },
    {
      title: "Fields",
      url: "/dashboard/fields",
      icon: FolderIcon,
    },
    {
      title: "Semesters",
      url: "/dashboard/semesters",
      icon: ListIcon,
    },
    {
      title: "Modules",
      url: "/dashboard/modules",
      icon: FileCodeIcon,
    },
    {
      title: "Submodules",
      url: "/dashboard/submodules",
      icon: FileIcon,
    },
    {
      title: "Resources",
      url: "/dashboard/resources",
      icon: DatabaseIcon,
    },
  ]

export default function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
      <>
      <Sidebar collapsible="offcanvas" {...props}>
          <SidebarHeader>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton
                          asChild
                          className="data-[slot=sidebar-menu-button]:!p-1.5"
                      >
                          <div className={'flex h-16 items-center justify-between'}>
                              <div className={'flex items-center space-x-4'}>

                              <GraduationCap className="h-8 w-8 text-primary" />
                              <span className="text-2xl font-bold font-heading text-primary">EduHub</span>
                              </div>

                          </div>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
              <AdminNav items={navMain} />
          </SidebarContent>
          <SidebarFooter>
          </SidebarFooter>
      </Sidebar>

      </>
  )
}