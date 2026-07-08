import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ApiDocs } from "@/components/api-docs"

export default function ApiDocPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-6">
                    <Link
                        href="/dashboard"
                        className="mb-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to dashboard
                    </Link>
                    <h1 className="text-xl font-bold text-slate-900">
                        API Documentation
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Every endpoint the LDB DVA backend exposes, in one place
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-8">
                <ApiDocs />
            </div>
        </div>
    )
}
