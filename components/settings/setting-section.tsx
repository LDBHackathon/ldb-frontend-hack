"use client"

import React, { useState } from "react"
import { Key, User, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ProfileSettings } from "@/components/settings/profile"
import { SecuritySettings } from "@/components/settings/security"
import { ApiSettings } from "@/components/settings/api"

type TabType = "api" | "profile" | "security"

export default function SettingSection() {
    const [activeTab, setActiveTab] = useState<TabType>("api")

    return (
        <div className="w-full min-h-screen bg-slate-100">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Sidebar Navigation */}
                <Card className="w-full md:w-64 shrink-0 border-0 shadow-sm overflow-hidden bg-white">
                    <div className="px-4 py-2 bg-slate-50/50">
                        <h2 className="font-semibold text-slate-900">
                            Settings
                        </h2>
                    </div>
                    <nav className="flex flex-col gap-1">
                        <button
                            onClick={() => setActiveTab("api")}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-colors ${
                                activeTab === "api"
                                    ? "bg-slate-100 text-slate-900 border-l-2 border-slate-900"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
                            }`}
                        >
                            <Key className="h-4 w-4" />
                            API credentials
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-colors ${
                                activeTab === "profile"
                                    ? "bg-slate-100 text-slate-900 border-l-2 border-slate-900"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
                            }`}
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("security")}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-colors ${
                                activeTab === "security"
                                    ? "bg-slate-100 text-slate-900 border-l-2 border-slate-900"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
                            }`}
                        >
                            <Shield className="h-4 w-4" />
                            Security
                        </button>
                    </nav>
                </Card>

                {/* Main Content Area */}
                <div className="flex-1 w-full max-w-4xl">
                    {activeTab === "profile" && <ProfileSettings />}
                    {activeTab === "security" && <SecuritySettings />}
                    {activeTab === "api" && <ApiSettings />}
                </div>
            </div>
        </div>
    )
}
