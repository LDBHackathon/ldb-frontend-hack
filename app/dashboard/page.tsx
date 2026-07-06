import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardOverview } from "@/components/dashboard-overview"
import { LiveTestBanner } from "@/components/live-test-banner"

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
              <LiveTestBanner />

              {/* Dashboard Content */}
              <DashboardOverview />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
