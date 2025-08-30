import Link from "next/link"
import { usePathname } from "next/navigation"
import { PlusCircleIcon, type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AdminNav({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/admin/upload" className="w-full">
              <SidebarMenuButton
                tooltip="Upload"
                className="w-full"
                isActive={pathname.startsWith("/admin/upload")}
              >
                <PlusCircleIcon />
                <span>Upload</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url} className="w-full">
                <SidebarMenuButton
                  tooltip={item.title}
                  className="w-full"
                  isActive={ pathname.endsWith(item.url)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
