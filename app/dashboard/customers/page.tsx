import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CustomersList } from "@/components/customers-list"

export default function CustomersPage() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "280px",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                {/* <SiteHeader /> */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <CustomersList />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
