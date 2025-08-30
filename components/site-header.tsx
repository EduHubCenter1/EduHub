"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

// A helper function to format the segment text for display
const formatSegment = (segment: string) => {
    if (!segment) return ""
    // Replace hyphens with spaces and capitalize each word
    return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function SiteHeader() {
    const pathname = usePathname()
    // Split the pathname by "/" and remove any empty strings (e.g., from the leading slash)
    const segments = pathname.split("/").filter(Boolean)
    // remove the first element
    segments.shift()

    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 w-full shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <nav aria-label="breadcrumb">
                    <ol className="flex items-center gap-2 text-sm font-medium sm:text-base">
                        {/* Root/Dashboard link */}
                        <li>
                            {segments.length === 0 ? (
                                <span className="text-foreground">Dashboard</span>
                            ) : (
                                <Link
                                    href="/dashboard"
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </li>

                        {/* Path segments */}
                        {segments.map((segment, index) => {
                            const href = `/${segments.slice(0, index + 1).join("/")}`
                            const isLast = index === segments.length - 1

                            return (
                                <React.Fragment key={href}>
                                    <li className="text-muted-foreground">/</li>
                                    <li>
                                        {isLast ? (
                                            <span className="text-foreground" aria-current="page">
                        {formatSegment(segment)}
                      </span>
                                        ) : (
                                            <Link
                                                href={href}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                {formatSegment(segment)}
                                            </Link>
                                        )}
                                    </li>
                                </React.Fragment>
                            )
                        })}
                    </ol>
                </nav>
            </div>
        </header>
    )
}