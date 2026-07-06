import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import SettingSection from "@/components/settings/setting-section"

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
        {/* Header */}
      <div className="mb-8 bg-white py-4 px-6">
        <h1 className="text-xl font-bold text-slate-900">Settings & API Center</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage credentials, webhooks, profile, billing and security
        </p>
      </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 lg:px-6">
              <SettingSection />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
