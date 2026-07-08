import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import TransactionsList from "@/components/transactions-list"

export default function TransactionPage() {
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
                    <TransactionsList />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
