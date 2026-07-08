import React from "react"
import { SimulateTransfer } from "./simulate-transfer"

export const LiveTestBanner = () => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="flex-1 justify-between rounded-lg bg-[#0B1F3A] p-4 text-slate-50 flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                    <span className="text-sm">
                        Live testing mode · Simulate an incoming bank transfer
                        to test DVA reconciliation
                    </span>
                </div>
                <SimulateTransfer />
            </div>
        </div>
    )
}
