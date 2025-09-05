'use client'
import * as React from "react"
import Image from "next/image"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import {
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FolderIcon,
    LayoutDashboardIcon,
    ListIcon,
    UsersIcon,
    UserCircleIcon,
    LogOutIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"

import { LogoutButton } from "@/components/auth/logout-button"

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
    const router = useRouter()
    const userRole = user?.user_metadata?.role
    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout', { method: 'POST' })
        if (res.ok) {
            router.push('/login')
            router.refresh()
        }
    }

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


                                                            <Link href="/">
                                <Image src="/sidebar.png" alt="EduHub Logo" width={100} height={100} />
                              </Link>
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
              {user && (
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 rounded-md w-full">
                              <UserCircleIcon className="h-5 w-5" />
                              <span className="text-sm font-medium truncate">
                                  {user.user_metadata.firstName || user.email}
                              </span>
                              {/*<LogOutIcon className="h-4 w-4 ml-auto" />*/}
                          </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start" className="w-56">
                          <DropdownMenuItem asChild>
                              <Link href="/dashboard">
                                  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                                  Dashboard
                              </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                             <Button
                                type="button"
                                className="flex items-center justify-start gap-2 w-full px-2 py-1.5 rounded-md hover:bg-gray-100 text-left"
                                onClick={handleLogout}
                              >
                                <LogOutIcon className="h-4 w-4" />
                                Déconnexion
                              </Button>
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              )}
          </SidebarFooter>
      </Sidebar>

      </>
  )
}