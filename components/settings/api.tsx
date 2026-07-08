"use client"

import React, { useEffect, useState } from "react"
import { Key, Shield, Copy, Eye, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCredentials, useWebhookSettings } from "@/hooks/use-settings-data"

const ALL_EVENTS = [
    "wallet.credited",
    "payment.partial",
    "payment.misdirected",
    "transfer.received",
    "account.created",
    "reconciliation.flagged",
]

function copyToClipboard(value: string) {
    if (!value) return
    navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard")
}

export function ApiSettings() {
    const {
        keys,
        isLoading: credsLoading,
        error: credsError,
        load: loadCreds,
        rotate,
        rotatedKey,
        isRotating,
    } = useCredentials()
    const {
        webhook,
        isLoading: webhookLoading,
        error: webhookError,
        load: loadWebhook,
        save,
        test,
        isSaving,
        isTesting,
    } = useWebhookSettings()

    const [webhookUrl, setWebhookUrl] = useState("")
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [revealSecret, setRevealSecret] = useState(false)

    useEffect(() => {
        loadCreds()
        loadWebhook()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (webhook) {
            setWebhookUrl(webhook.url ?? "")
            setSelectedEvents(webhook.events ?? [])
        }
    }, [webhook])

    const toggleEvent = (event: string) => {
        setSelectedEvents((prev) =>
            prev.includes(event)
                ? prev.filter((e) => e !== event)
                : [...prev, event]
        )
    }

    return (
        <div className="space-y-6">
            {/* API Credentials */}
            <Card className="border border-slate-200 bg-white p-6 md:p-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-slate-700" />
                        <h2 className="text-lg font-bold text-slate-900">
                            API credentials
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span className="text-sm text-slate-500 font-medium">
                            {credsLoading
                                ? "Loading…"
                                : `${keys.length} key${keys.length === 1 ? "" : "s"}`}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                    Use these keys to authenticate API requests. Never share
                    your secret key — treat it like a password.
                </p>

                {credsError && (
                    <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <span>{credsError}</span>
                        <Button variant="outline" size="sm" onClick={loadCreds}>
                            Retry
                        </Button>
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    {!credsLoading && !credsError && keys.length === 0 && (
                        <p className="text-sm text-slate-400">
                            No API keys found for this merchant yet.
                        </p>
                    )}

                    {keys.map((key, index) => {
                        const prefix =
                            key.prefix ?? key.api_key_prefix ?? "Not available"
                        return (
                            <div key={key.id ?? index} className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                    API Key{" "}
                                    {keys.length > 1
                                        ? `#${index + 1}`
                                        : "Prefix"}
                                    {key.status ? ` · ${key.status}` : ""}
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        readOnly
                                        value={prefix}
                                        className="bg-slate-50 font-mono text-sm h-11"
                                    />
                                    <Button
                                        variant="outline"
                                        className="h-11 px-4 gap-2 text-slate-700"
                                        onClick={() => copyToClipboard(prefix)}
                                    >
                                        <Copy className="h-4 w-4" />
                                        Copy
                                    </Button>
                                </div>
                            </div>
                        )
                    })}

                    {rotatedKey && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                                New secret key — shown once, copy it now
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    type={revealSecret ? "text" : "password"}
                                    value={rotatedKey}
                                    className="bg-emerald-50 font-mono text-sm h-11"
                                />
                                <Button
                                    variant="outline"
                                    className="h-11 px-4 gap-2 text-slate-700"
                                    onClick={() => setRevealSecret((v) => !v)}
                                >
                                    <Eye className="h-4 w-4" />
                                    {revealSecret ? "Hide" : "Reveal"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-11 px-4 gap-2 text-slate-700"
                                    onClick={() => copyToClipboard(rotatedKey)}
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <Button
                    variant="outline"
                    className="gap-2 text-slate-700"
                    onClick={rotate}
                    disabled={isRotating}
                >
                    <RefreshCw className="h-4 w-4" />
                    {isRotating ? "Rotating…" : "Rotate keys"}
                </Button>
            </Card>

            {/* Webhook Registration */}
            <Card className="border border-slate-200 bg-white p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-slate-700" />
                    <h2 className="text-lg font-bold text-slate-900">
                        Webhook registration
                    </h2>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                    Register your endpoint to receive real-time notifications
                    when transfers land, wallets are credited, or edge cases are
                    flagged.
                </p>

                {webhookError && (
                    <div className="mb-6 flex items-center justify-between rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <span>{webhookError}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadWebhook}
                        >
                            Retry
                        </Button>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Webhook Endpoint URL
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder={
                                    webhookLoading
                                        ? "Loading…"
                                        : "https://your-app.com/webhooks/ldb"
                                }
                                className="h-11 flex-1"
                            />
                        </div>
                        {!webhookLoading && !webhook && !webhookError && (
                            <p className="text-xs text-slate-400">
                                No webhook registered yet.
                            </p>
                        )}
                    </div>

                    {webhook?.signing_secret && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                Webhook Signing Secret
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value={webhook.signing_secret}
                                    className="bg-slate-50 font-mono text-sm h-11 flex-1"
                                />
                                <Button
                                    variant="outline"
                                    className="h-11 px-4 gap-2 text-slate-700"
                                    onClick={() =>
                                        copyToClipboard(
                                            webhook.signing_secret ?? ""
                                        )
                                    }
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Subscribe to Events
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ALL_EVENTS.map((event) => {
                                const active = selectedEvents.includes(event)
                                return (
                                    <Badge
                                        key={event}
                                        onClick={() => toggleEvent(event)}
                                        className={
                                            "cursor-pointer font-mono text-xs py-1.5 px-3 border " +
                                            (active
                                                ? "bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-100"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200")
                                        }
                                    >
                                        {event}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                        <Button
                            className="bg-[#48b79f] hover:bg-[#3ca08a] text-white"
                            onClick={() => save(webhookUrl, selectedEvents)}
                            disabled={isSaving || !webhookUrl}
                        >
                            {isSaving ? "Saving…" : "Save webhook"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={test}
                            disabled={isTesting || !webhook}
                        >
                            {isTesting ? "Sending…" : "Test endpoint"}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
