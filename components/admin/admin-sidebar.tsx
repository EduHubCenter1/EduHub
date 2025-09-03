'use client'
import * as React from "react"
import Image from "next/image"
import {
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FolderIcon, GraduationCap,
    LayoutDashboardIcon,
    ListIcon,
    UsersIcon,
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"
import { AdminNav } from "@/components/admin/admin-nav"
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const allNavItems = [
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

const classAdminNavItems = [
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
  const { user, loading } = useAuth()
  const userRole = user?.user_metadata?.role

  const getNavItems = () => {
    if (loading) {
      return [] // Or a loading skeleton
    }

    switch (userRole) {
      case "superAdmin":
        return allNavItems
      case "classAdmin":
        return classAdminNavItems
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const userProfile = user ? {
      name: `${user.user_metadata.firstName || ''} ${user.user_metadata.lastName || ''}`.trim() || user.email,
      email: user.email || "",
      avatar: user.user_metadata.avatar || "/placeholder-user.jpg",
  } : null

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
                          <div className={'flex items-center justify-between'}>
                              <div className={'flex items-center space-x-4'}>


                              <Image src="/newlogo.png" alt="EduHub Logo" width={100} height={100} />
                              </div>

                          </div>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
              <AdminNav items={navItems} />
          </SidebarContent>
          <SidebarFooter>
              {userProfile && <NavUser user={userProfile} />}
          </SidebarFooter>
      </Sidebar>

      </>
  )
}