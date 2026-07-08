"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: React.ReactNode
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                {/*         <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
            >
              <CirclePlusIcon
              />
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu> */}
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    MENU
                </p>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url}>
                                <SidebarMenuButton
                                    className="text-white/65 hover:bg-(--color-vault-teal)/12 hover:text-(--color-vault-teal)"
                                    tooltip={item.title}
                                >
                                    {item.icon}
                                    <span className="text-white/65 hover:text-(--color-vault-teal)">
                                        {item.title}
                                    </span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
