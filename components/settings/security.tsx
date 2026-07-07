"use client"

import React, { useState } from "react"
import { Shield, Monitor, Smartphone, LogOut } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useChangePassword } from "@/hooks/use-security"

export function SecuritySettings() {
  const { changePassword, isSubmitting } = useChangePassword()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Enter your current and new password")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    const ok = await changePassword({
      current_password: currentPassword,
      new_password: newPassword,
    })
    if (ok) {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card className="border border-slate-200 bg-white p-6 md:p-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">Password</h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Use a strong, unique password. We recommend at least 12 characters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Current password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Confirm new</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        <Button
          className="bg-[#48b79f] hover:bg-[#3ca08a] text-white"
          onClick={handleUpdatePassword}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating…" : "Update password"}
        </Button>
      </Card>

      {/* 2FA Section - NOTE: not documented in the API Flow Guide. Kept as
          static UI; wire up once a real 2FA endpoint exists. */}
      <Card className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-5 w-5 text-slate-700" />
              <h2 className="text-lg font-bold text-slate-900">Two-factor authentication</h2>
            </div>
            <p className="text-sm font-medium text-slate-900 mt-3">Authenticator app (TOTP)</p>
            <p className="text-sm text-slate-500">Enabled · required at every sign-in</p>
          </div>
          <div className="w-12 h-6 bg-[#48b79f] rounded-full relative cursor-pointer flex items-center px-1">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 shadow-sm"></div>
          </div>
        </div>
      </Card>

      {/* Active Sessions - NOTE: not documented in the API Flow Guide.
          Kept as static UI; wire up once a real sessions endpoint exists. */}
      <Card className="border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">Active sessions</h2>
          </div>
          <button className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Revoke all
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Monitor className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">MacBook Pro · Chrome</p>
                <p className="text-xs text-slate-500">Lagos, NG · Active now</p>
              </div>
            </div>
            <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-0">This device</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Smartphone className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">iPhone 15 · Safari</p>
                <p className="text-xs text-slate-500">Lagos, NG · 3 hours ago</p>
              </div>
            </div>
            <button className="text-sm text-slate-500 hover:text-slate-700 font-medium">Revoke</button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-lg">
                <Monitor className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Windows · Edge</p>
                <p className="text-xs text-slate-500">Abuja, NG · Yesterday</p>
              </div>
            </div>
            <button className="text-sm text-slate-500 hover:text-slate-700 font-medium">Revoke</button>
          </div>
        </div>
      </Card>

      {/* Danger Zone - NOTE: not documented in the API Flow Guide. */}
      <Card className="border border-red-200 bg-red-50/30 p-6">
        <h2 className="text-lg font-bold text-red-600 mb-2 flex items-center gap-2">
          <span className="text-red-500">↗</span> Danger zone
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Deactivating suspends all API access and webhooks for your organization.
        </p>
      </Card>
    </div>
  )
}
