import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Download } from "lucide-react"

export function SiteHeader() {
    const today = new Date()
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    return (
        <header className="flex py-8 h-(--header-height) bg-white shrink-0 items-center justify-between shadow-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-2 px-4 lg:gap-3 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                {/* <Separator
          orientation="vertical"
          className="mx-1 data-[orientation=vertical]:h-4"
        /> */}
                <div className="flex flex-col gap-1">
                    <h1 className="text-base font-semibold text-slate-900">
                        Dashboard
                    </h1>
                    <p className="text-xs text-slate-500">
                        LDB Africa · {formattedDate}
                    </p>
                </div>
            </div>
            <div className="px-4 lg:px-6">
                <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </div>
        </header>
    )
}
