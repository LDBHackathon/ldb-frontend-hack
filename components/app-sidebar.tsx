"use client"

import * as React from "react"
import { useEffect } from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useProfileSettings } from "@/hooks/use-profile"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
    ShieldCheck,
    LayoutDashboardIcon,
    UsersIcon,
    ReceiptText,
    Settings2Icon,
    DatabaseIcon,
    FileChartColumnIcon,
    FileIcon,
} from "lucide-react"

const sidebarNavigationData = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: <LayoutDashboardIcon />,
        },
        {
            title: "Customers",
            url: "/dashboard/customers",
            icon: <UsersIcon />,
        },
        {
            title: "Transactions",
            url: "/dashboard/transactions",
            icon: <ReceiptText />,
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: <Settings2Icon />,
        },
    ],
    documents: [
        {
            name: "Data Library",
            url: "#",
            icon: <DatabaseIcon />,
        },
        {
            name: "Reports",
            url: "#",
            icon: <FileChartColumnIcon />,
        },
        {
            name: "Word Assistant",
            url: "#",
            icon: <FileIcon />,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // Pulling merchant data exactly using your profile code guide architecture
    const { profile, load } = useProfileSettings()

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Safely mapping the custom fields from the dynamic merchant payload
    const merchantUser = {
        name: profile?.full_name ?? profile?.name ?? "Loading...",
        businessName: profile?.business_name ?? "Business Account", // Swapping email for business name
        avatar: profile?.avatar_url,
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:py-5.5!"
                        >
                            <a href="/dashboard">
                                <div className="flex h-10 w-10 items-center justify-center text-black rounded-md bg-(--color-emerald) shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
                                    <ShieldCheck className="size-5!" />
                                </div>
                                <span className="text-base font-semibold">
                                    LDB Africa
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={sidebarNavigationData.navMain} />
                <NavDocuments items={sidebarNavigationData.documents} />
            </SidebarContent>
            <SidebarFooter>
                {/* Passing the dynamic profile state data seamlessly */}
                <NavUser
                    user={{
                        name: merchantUser.name,
                        app: "LDB Africa",
                        avatar: merchantUser.avatar ?? "",
                    }}
                />
            </SidebarFooter>
        </Sidebar>
    )
}
