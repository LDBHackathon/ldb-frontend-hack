"use client"

import React from "react"
import { Key, Shield, Copy, Eye, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ApiSettings() {
  return (
    <div className="space-y-6">
      {/* API Credentials */}
      <Card className="border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">API credentials</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-slate-500 font-medium">Active</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Use these keys to authenticate API requests. Never share your secret key — treat it like a password.
        </p>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Public Key (Client ID)
            </label>
            <div className="flex gap-2">
              <Input readOnly value="pk_live_wv_a8c3f29e1b4d7f6a2c5e8d0b3f9a1c4e" className="bg-slate-50 font-mono text-sm h-11" />
              <Button variant="outline" className="h-11 px-4 gap-2 text-slate-700">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Secret Key
            </label>
            <div className="flex gap-2">
              <Input readOnly value="sk_live_wv_••••••••••••••••••••••••••••" className="bg-slate-50 font-mono text-sm h-11" />
              <Button variant="outline" className="h-11 px-4 gap-2 text-slate-700">
                <Eye className="h-4 w-4" />
                Reveal
              </Button>
              <Button variant="outline" className="h-11 px-4 gap-2 text-slate-700">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        </div>

        <Button variant="outline" className="gap-2 text-slate-700">
          <RefreshCw className="h-4 w-4" />
          Rotate keys
        </Button>
      </Card>

      {/* Webhook Registration */}
      <Card className="border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">Webhook registration</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Register your endpoint to receive real-time notifications when transfers land, wallets are credited, or edge cases are flagged.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Webhook Endpoint URL
            </label>
            <div className="flex gap-2">
              <Input defaultValue="https://your-app.com/webhooks/LDB Africa" className="h-11 flex-1" />
              <Button className="bg-[#48b79f] hover:bg-[#3ca08a] text-white h-11 px-6">
                Register
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Webhook Signing Secret
            </label>
            <div className="flex gap-2">
              <Input readOnly value="whsec_wv_9b2d4e1f7a3c8d6e2b5f1a4c7e0d3b8f" className="bg-slate-50 font-mono text-sm h-11 flex-1" />
              <Button variant="outline" className="h-11 px-4 gap-2 text-slate-700">
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Subscribe to Events
            </label>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border border-teal-100 font-mono text-xs py-1.5 px-3">
                wallet.credited
              </Badge>
              <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border border-teal-100 font-mono text-xs py-1.5 px-3">
                payment.partial
              </Badge>
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border border-slate-200 font-mono text-xs py-1.5 px-3">
                payment.misdirected
              </Badge>
              <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border border-teal-100 font-mono text-xs py-1.5 px-3">
                transfer.received
              </Badge>
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border border-slate-200 font-mono text-xs py-1.5 px-3">
                account.created
              </Badge>
              <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 border border-slate-200 font-mono text-xs py-1.5 px-3">
                reconciliation.flagged
              </Badge>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <Button className="bg-[#48b79f] hover:bg-[#3ca08a] text-white">
              Save webhook
            </Button>
            <Button variant="outline">Test endpoint</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}