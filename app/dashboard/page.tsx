import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SimulateTransfer } from "@/components/simulate-transfer"
import { DashboardOverview } from "@/components/dashboard-overview"

export default function Page() {
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
        <SiteHeader />
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 space-y-6">
              {/* Live Testing Banner */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 justify-between rounded-lg bg-[#0B1F3A] p-4 text-slate-50 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                        <span className="text-sm">
                            Live testing mode · Simulate an incoming bank transfer to test DVA reconciliation
                        </span>
                    </div>
                <SimulateTransfer />
                </div>
              </div>

              {/* Dashboard Content */}
              <DashboardOverview />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
