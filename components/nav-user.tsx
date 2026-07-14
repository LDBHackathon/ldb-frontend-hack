"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"
import { useCurrentMerchant, useLogout } from "@/hooks/use-auth"

export function NavUser({
    user,
}: {
    user: {
        name: string
        app: string
        avatar: string
    }
}) {
    const { merchant } = useCurrentMerchant()
    const logout = useLogout()

    // Confirmed from MerchantResponse: id, name, email, status - no
    // separate business_name/full_name fields.
    const displayName = merchant?.name || user.name
    const displayEmail = merchant?.email

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage src={user.avatar} alt={displayName} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">
                            {displayEmail ?? user.app}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation()
                            logout()
                        }}
                        className="ml-auto rounded p-0.5 hover:bg-sidebar-accent"
                        aria-label="Sign out"
                        title="Sign out"
                    >
                        <LogOutIcon className="size-4" />
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
