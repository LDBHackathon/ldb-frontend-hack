"use client"

import React, { useEffect, useRef, useState } from "react"
import { User, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useProfileSettings } from "@/hooks/use-profile"
import { useFileUpload } from "@/hooks/use-file-upload"

function initials(name: string): string {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

export function ProfileSettings() {
    const { profile, isLoading, error, isSaving, load, save } =
        useProfileSettings()
    const { upload, isUploading } = useFileUpload("/api/portal/files/upload")
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Confirmed real fields (UpdateProfileSettingsRequestSchema): name, phone.
    // Email is shown read-only (identity, not editable from this form -
    // the backend doesn't accept it in the profile PATCH).
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    // The avatar upload endpoint (POST /portal/files/upload) is real, but
    // there's no confirmed field on the merchant profile to persist the
    // resulting URL - so this is local-session-only for now.
    const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined)

    useEffect(() => {
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!profile) return
        setName(profile.name ?? "")
        setPhone(profile.phone ?? "")
    }, [profile])

    const handlePhotoChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if (!file) return
        const url = await upload(file)
        if (url) setAvatarUrl(url)
        event.target.value = ""
    }

    const handleSave = async () => {
        await save({ name, phone })
    }

    return (
        <Card className="border border-slate-200 bg-white p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5 text-slate-700" />
                <h2 className="text-lg font-bold text-slate-900">
                    Personal profile
                </h2>
            </div>
            <p className="text-sm text-slate-500 mb-8">
                Your account details and how you appear to teammates.
            </p>

            {error && (
                <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    <span>{error}</span>
                    <Button variant="outline" size="sm" onClick={load}>
                        Retry
                    </Button>
                </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8">
                <div className="h-20 w-20 rounded-full bg-teal-100 flex items-center justify-center text-xl font-bold text-teal-600 overflow-hidden">
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={avatarUrl}
                            alt={name || "Avatar"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        initials(name || "?") || "?"
                    )}
                </div>
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                    <Button
                        variant="outline"
                        className="gap-2 mb-2 hover:bg-slate-100"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        <Camera className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Change photo"}
                    </Button>
                    <p className="text-xs text-slate-500">
                        JPG or PNG · max 2MB · shown for this session only
                    </p>
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Full name
                    </label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isLoading ? "Loading…" : "Full name"}
                        className="h-11"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Email
                    </label>
                    <Input
                        readOnly
                        value={profile?.email ?? ""}
                        placeholder={isLoading ? "Loading…" : "—"}
                        className="h-11 bg-slate-50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                        Phone
                    </label>
                    <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={isLoading ? "Loading…" : "Phone number"}
                        className="h-11"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
                <Button
                    className="bg-[#48b79f] hover:bg-[#3ca08a] text-white"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving…" : "Save changes"}
                </Button>
                <Button variant="outline" onClick={load}>
                    Cancel
                </Button>
            </div>
        </Card>
    )
}
