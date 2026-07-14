"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"
import { ClientApiError } from "@/lib/api/client"
import type { OnboardingDocumentsListResponse, UploadedFile } from "@/lib/types/api"

function extractUrl(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") return null
    const obj = payload as Partial<UploadedFile> &
        Partial<OnboardingDocumentsListResponse> &
        Record<string, unknown>

    // POST /portal/files/upload -> UploadFileResponse.url
    if (typeof obj.url === "string") return obj.url

    // POST /portal/onboarding/documents -> OnboardingDocumentsListResponseSchema.document.file_url
    if (obj.document && typeof obj.document.file_url === "string") {
        return obj.document.file_url
    }
    if (
        Array.isArray(obj.documents) &&
        typeof obj.documents[0]?.file_url === "string"
    ) {
        return obj.documents[0].file_url
    }

    return null
}

/**
 * Uploads a file to one of our upload proxy routes and returns the hosted
 * URL. Used for onboarding documents (POST /portal/onboarding/documents)
 * and generic assets like an avatar photo (POST /portal/files/upload).
 */
export function useFileUpload(path: string) {
    const [isUploading, setIsUploading] = useState(false)

    const upload = useCallback(
        async (file: File, extraFields?: Record<string, string>) => {
            setIsUploading(true)
            try {
                const formData = new FormData()
                formData.append("file", file)
                if (extraFields) {
                    for (const [key, value] of Object.entries(extraFields)) {
                        formData.append(key, value)
                    }
                }

                const response = await fetch(path, {
                    method: "POST",
                    body: formData,
                    credentials: "same-origin",
                })
                const payload = await response.json().catch(() => undefined)

                if (!response.ok) {
                    const message = payload?.message ?? "Upload failed"
                    toast.error(message)
                    throw new ClientApiError(message, response.status)
                }

                const url = extractUrl(payload?.data)
                if (!url) {
                    toast.error(
                        "File uploaded, but the backend didn't return a URL we recognize."
                    )
                    return null
                }
                return url
            } catch (err) {
                if (!(err instanceof ClientApiError)) {
                    toast.error("Upload failed")
                }
                return null
            } finally {
                setIsUploading(false)
            }
        },
        [path]
    )

    return { upload, isUploading }
}
