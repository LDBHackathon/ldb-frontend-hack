"use client"

import { ArrowLeft, ArrowRight, Check, UploadCloud } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verificationSchema, type VerificationFormValues } from "@/lib/onboarding-schema"
import { useOnboardingStore } from "@/lib/onboarding-store"
import { useSubmitVerificationStep } from "@/hooks/use-onboarding-api"
import { useFileUpload } from "@/hooks/use-file-upload"

const emptyValues: VerificationFormValues = {
  directorName: "",
  bvnId: "",
  cacDocument: "",
  addressProof: "",
  notes: "",
  consent: false,
}

export function VerificationForm() {
  const router = useRouter()
  const data = useOnboardingStore((state) => state.data.verification)
  const hasHydrated = useOnboardingStore((state) => state.hasHydrated)
  const setStepData = useOnboardingStore((state) => state.setStepData)
  const { submit, isSubmitting } = useSubmitVerificationStep()
  const { upload: uploadDocument, isUploading: isUploadingCac } = useFileUpload(
    "/api/onboarding/documents"
  )
  const { upload: uploadAddressDoc, isUploading: isUploadingAddress } = useFileUpload(
    "/api/onboarding/documents"
  )
  const [values, setValues] = useState<VerificationFormValues>(data ?? emptyValues)
  const [errors, setErrors] = useState<Partial<Record<keyof VerificationFormValues, string>>>({})
  const [cacFileName, setCacFileName] = useState("")
  const [addressFileName, setAddressFileName] = useState("")
  // URLs returned by the backend after upload - these are what actually get
  // submitted as cac_document_url / address_proof_url.
  const [cacDocumentUrl, setCacDocumentUrl] = useState("")
  const [addressProofUrl, setAddressProofUrl] = useState("")

  const cacInputRef = useRef<HTMLInputElement>(null)
  const addressInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!hasHydrated) return
    if (!useOnboardingStore.getState().data.account?.fullName) {
      router.replace("/onboarding/account")
    }
  }, [hasHydrated, router])

  const handleCacFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setCacFileName(file.name)
    const url = await uploadDocument(file, { document_type: "cac_certificate" })
    if (url) {
      setCacDocumentUrl(url)
      setValues((current) => ({ ...current, cacDocument: url }))
      setErrors((current) => ({ ...current, cacDocument: undefined }))
    }
    event.target.value = ""
  }

  const handleAddressFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAddressFileName(file.name)
    const url = await uploadAddressDoc(file, { document_type: "proof_of_address" })
    if (url) {
      setAddressProofUrl(url)
      setValues((current) => ({ ...current, addressProof: url }))
    }
    event.target.value = ""
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = verificationSchema.safeParse(values)
    if (!result.success) {
      const nextErrors = result.error.flatten().fieldErrors as Partial<Record<keyof VerificationFormValues, string[]>>
      const mappedErrors = Object.fromEntries(
        Object.entries(nextErrors).map(([key, value]) => [key, value?.[0]])
      ) as Partial<Record<keyof VerificationFormValues, string>>
      setErrors(mappedErrors)
      return
    }

    setErrors({})

    const ok = await submit({
      director_name: result.data.directorName ?? "",
      bvn: result.data.bvnId ?? "",
      consent: result.data.consent,
      notes: result.data.notes,
      cac_document_url: cacDocumentUrl || undefined,
      address_proof_url: addressProofUrl || undefined,
    })
    if (!ok) return

    setStepData("verification", result.data)
    router.push("/onboarding/review")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-(--color-vault-teal)">
          Verification
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          Finalize the verification details for your business.
        </h2>
      </div>

      <div className="rounded-md border border-cyan-100/30 bg-cyan-50/40 p-4 text-sm text-slate-700">
        Provide a director&apos;s details and upload incorporation documents for compliance review.
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="directorName" className="text-sm font-medium text-(--color-slate)">Director / owner name</label>
            <Input
              id="directorName"
              value={values.directorName}
              onChange={(event) => {
                setValues((current) => ({ ...current, directorName: event.target.value }))
                setErrors((current) => ({ ...current, directorName: undefined }))
              }}
              placeholder="Full legal name"
              className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
            />
            {errors.directorName ? <p className="text-sm text-rose-600">{errors.directorName}</p> : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="bvnId" className="text-sm font-medium text-(--color-slate)">Director BVN / ID</label>
            <Input
              id="bvnId"
              value={values.bvnId}
              onChange={(event) => {
                setValues((current) => ({ ...current, bvnId: event.target.value }))
                setErrors((current) => ({ ...current, bvnId: undefined }))
              }}
              placeholder="22XXXXXXXXX"
              className="h-12 rounded-md border-slate-200 bg-slate-50 px-4 text-base text-(--color-slate)"
            />
            {errors.bvnId ? <p className="text-sm text-rose-600">{errors.bvnId}</p> : null}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-(--color-slate)">CAC / incorporation certificate</label>
          <button
            type="button"
            onClick={() => cacInputRef.current?.click()}
            className="w-full rounded-md border border-dashed border-slate-200 bg-white/50 p-4 text-sm text-slate-700 flex items-center justify-start gap-4 hover:bg-slate-50"
          >
            <div className="h-8 w-8 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500">
              {cacDocumentUrl ? <Check className="size-4 text-emerald-600" /> : <UploadCloud className="size-4" />}
            </div>
            <div className="text-left">
              <div className="font-medium">
                {isUploadingCac ? "Uploading…" : cacFileName || "Click to upload"}
              </div>
              <div className="text-xs text-slate-400">
                {cacDocumentUrl ? "Uploaded" : "PDF, JPG or PNG · max 10MB"}
              </div>
            </div>
          </button>
          <input
            ref={cacInputRef}
            id="cacDocument"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleCacFileSelected}
            className="hidden"
          />
          {errors.cacDocument ? <p className="text-sm text-rose-600">{errors.cacDocument}</p> : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="addressProof" className="text-sm font-medium text-(--color-slate)">Proof of business address</label>
            <span className="text-xs text-slate-400">Optional</span>
          </div>
          <button
            type="button"
            onClick={() => addressInputRef.current?.click()}
            className="w-full rounded-md border border-dashed border-slate-200 bg-white/50 p-4 text-sm text-slate-700 flex items-center justify-start gap-4 hover:bg-slate-50"
          >
            <div className="h-8 w-8 rounded-md border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-500">
              {addressProofUrl ? <Check className="size-4 text-emerald-600" /> : <UploadCloud className="size-4" />}
            </div>
            <div className="text-left">
              <div className="font-medium">
                {isUploadingAddress ? "Uploading…" : addressFileName || "Click to upload"}
              </div>
              <div className="text-xs text-slate-400">
                {addressProofUrl ? "Uploaded" : "PDF, JPG or PNG · max 10MB"}
              </div>
            </div>
          </button>
          <input
            ref={addressInputRef}
            id="addressProof"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleAddressFileSelected}
            className="hidden"
          />
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(event) => {
                setValues((current) => ({ ...current, consent: event.target.checked }))
                setErrors((current) => ({ ...current, consent: undefined }))
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
            />
            <span>
              I confirm the information provided is accurate and I&apos;m authorised to onboard this business. I accept the <a className="text-cyan-600 underline" href="#">Terms of Service</a> and <a className="text-cyan-600 underline" href="#">Data Processing Agreement</a>.
            </span>
          </label>
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(event) => {
              setValues((current) => ({ ...current, consent: event.target.checked }))
              setErrors((current) => ({ ...current, consent: undefined }))
            }}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
          />
          <span>I agree to share these details with the verification team.</span>
        </label>
        {errors.consent ? <p className="text-sm text-rose-600">{errors.consent}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/onboarding/business")}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isUploadingCac || isUploadingAddress}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-(--color-vault-teal) text-base font-semibold text-white hover:bg-cyan-700 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Review details"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <p className="text-center text-base text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-(--color-vault-teal)">
            Sign in
          </a>
        </p>
      </form>
    </div>
  )
}
