"use client"

import React, { useMemo, useState } from "react"
import { Search, Copy, BookOpen, ServerCog } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    AUTH_LABELS,
    endpointGroups,
    responseEnvelopeExample,
    type AuthMode,
    type HttpMethod,
} from "@/lib/api-docs-data"

const BASE_URL =
    process.env.NEXT_PUBLIC_DOCS_BASE_URL ??
    "https://hackathon-api.ldbafrica.com"

const METHOD_STYLES: Record<HttpMethod, string> = {
    GET: "bg-emerald-50 text-emerald-700 border-emerald-100",
    POST: "bg-sky-50 text-sky-700 border-sky-100",
    PATCH: "bg-amber-50 text-amber-700 border-amber-100",
    PUT: "bg-amber-50 text-amber-700 border-amber-100",
    DELETE: "bg-rose-50 text-rose-700 border-rose-100",
}

const AUTH_STYLES: Record<AuthMode, string> = {
    none: "bg-slate-100 text-slate-600 border-slate-200",
    session: "bg-teal-50 text-teal-700 border-teal-100",
    bearer: "bg-purple-50 text-purple-700 border-purple-100",
    "session-or-bearer": "bg-teal-50 text-teal-700 border-teal-100",
}

function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value)
    toast.success("Copied to clipboard")
}

export function ApiDocs() {
    const [query, setQuery] = useState("")

    const filteredGroups = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return endpointGroups
        return endpointGroups
            .map((group) => ({
                ...group,
                endpoints: group.endpoints.filter(
                    (e) =>
                        e.path.toLowerCase().includes(q) ||
                        e.summary.toLowerCase().includes(q) ||
                        e.method.toLowerCase().includes(q)
                ),
            }))
            .filter((group) => group.endpoints.length > 0)
    }, [query])

    return (
        <div className="space-y-6">
            {/* Header card */}
            <Card className="border border-slate-200 bg-white p-6 md:p-8">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-slate-700" />
                    <h2 className="text-lg font-bold text-slate-900">
                        API reference
                    </h2>
                </div>
                <p className="text-sm text-slate-500 mb-6">
                    Every endpoint this dashboard talks to, grouped by area.
                    Portal routes accept a session cookie or a Bearer API key;
                    developer routes require a Bearer key and an active
                    merchant.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                        <ServerCog className="h-4 w-4 text-slate-400" />
                        <code className="rounded-md bg-slate-50 px-2 py-1 text-xs font-mono text-slate-600">
                            {BASE_URL}
                        </code>
                        <button
                            onClick={() => copyToClipboard(BASE_URL)}
                            className="text-slate-400 hover:text-slate-600"
                            aria-label="Copy base URL"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search endpoints..."
                            className="h-10 pl-10"
                        />
                    </div>
                </div>
            </Card>

            {/* Response envelope reference */}
            <Card className="border border-slate-200 bg-white p-6 md:p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-4">
                    Response format
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                            Success
                        </p>
                        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
                            <code>{responseEnvelopeExample.success}</code>
                        </pre>
                    </div>
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-rose-600">
                            Failure
                        </p>
                        <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
                            <code>{responseEnvelopeExample.failure}</code>
                        </pre>
                    </div>
                </div>
            </Card>

            {/* Endpoint groups */}
            {query.trim() ? (
                <div className="space-y-6">
                    {filteredGroups.length === 0 && (
                        <Card className="border border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
                            No endpoints match &ldquo;{query}&rdquo;.
                        </Card>
                    )}
                    {filteredGroups.map((group) => (
                        <EndpointGroupCard key={group.id} group={group} />
                    ))}
                </div>
            ) : (
                <Tabs defaultValue={endpointGroups[0].id}>
                    <TabsList className="flex-wrap h-auto bg-slate-100">
                        {endpointGroups.map((group) => (
                            <TabsTrigger
                                key={group.id}
                                value={group.id}
                                className="text-xs"
                            >
                                {group.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {endpointGroups.map((group) => (
                        <TabsContent
                            key={group.id}
                            value={group.id}
                            className="mt-4"
                        >
                            <EndpointGroupCard group={group} />
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    )
}

function EndpointGroupCard({
    group,
}: {
    group: (typeof endpointGroups)[number]
}) {
    return (
        <Card className="border border-slate-200 bg-white mt-10 md:mt-5  p-6 md:p-8">
            <h3 className="text-base font-bold text-slate-900">
                {group.title}
            </h3>
            <p className="mb-6 text-sm text-slate-500">{group.description}</p>

            <div className="space-y-4">
                {group.endpoints.map((endpoint) => (
                    <div
                        key={`${endpoint.method}-${endpoint.path}`}
                        className="rounded-lg border border-slate-200 p-4"
                    >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge
                                variant="outline"
                                className={`${METHOD_STYLES[endpoint.method]} font-mono text-xs`}
                            >
                                {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono text-slate-800">
                                {endpoint.path}
                            </code>
                            <Badge
                                variant="outline"
                                className={`${AUTH_STYLES[endpoint.auth]} ml-auto text-xs`}
                            >
                                {AUTH_LABELS[endpoint.auth]}
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                            {endpoint.summary}
                        </p>

                        {(endpoint.requestExample ||
                            endpoint.responseExample) && (
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {endpoint.requestExample && (
                                    <div>
                                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Request
                                        </p>
                                        <pre className="overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                                            <code>
                                                {endpoint.requestExample}
                                            </code>
                                        </pre>
                                    </div>
                                )}
                                {endpoint.responseExample && (
                                    <div>
                                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Response
                                        </p>
                                        <pre className="overflow-x-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">
                                            <code>
                                                {endpoint.responseExample}
                                            </code>
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}

                        {endpoint.notes && (
                            <p className="mt-2 text-xs text-slate-400">
                                {endpoint.notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}
