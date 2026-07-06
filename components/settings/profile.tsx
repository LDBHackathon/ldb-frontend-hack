"use client"

import React from "react"
import { User, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function ProfileSettings() {
  return (
    <Card className="border border-slate-200 bg-white p-6 md:p-8">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-5 w-5 text-slate-700" />
        <h2 className="text-lg font-bold text-slate-900">Personal profile</h2>
      </div>
      <p className="text-sm text-slate-500 mb-8">
        Your account details and how you appear to teammates.
      </p>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-600">
          AO
        </div>
        <div>
          <Button variant="outline" className="gap-2 mb-2">
            <Camera className="h-4 w-4" />
            Change photo
          </Button>
          <p className="text-xs text-slate-500">JPG or PNG · max 2MB</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Full name</label>
          <Input defaultValue="Amara Olu" className="h-11" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Work email</label>
          <Input defaultValue="amara@luminamfb.com" className="h-11" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <Input defaultValue="+234 802 114 9920" className="h-11" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Language</label>
          <Input defaultValue="English (UK)" className="h-11" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-slate-100">
        <Button className="bg-[#48b79f] hover:bg-[#3ca08a] text-white">
          Save changes
        </Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </Card>
  )
}