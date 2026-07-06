import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { CustomerProfile } from "@/components/customer-profile"

interface CustomerProfilePageProps {
  // 1. Define params as a Promise
  params: Promise<{
    id: string
  }>
}

// 2. Make the page component an async function
export default async function CustomerProfilePage({
  params,
}: CustomerProfilePageProps) {
  
  // 3. Await the parameters to extract the true string ID
  const resolvedParams = await params

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
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6 lg:px-6">
              {/* 4. Pass the resolved string ID safely to the child */}
              <CustomerProfile customerId={resolvedParams.id} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}