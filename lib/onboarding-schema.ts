import { z } from "zod"

const baseSchema = z.object({
  fullName: z.string().trim().min(2, "full name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Use at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeToTerms: z.boolean().refine((value) => value, "You must accept the terms"),
  addressLine: z.string().trim().min(2, "Street address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  /* postalCode: z.string().trim().min(2, "Postal code is required"), */
  country: z.string().trim().min(2, "Country is required"),
  businessName: z.string().trim().min(2, "Business name is required"),
  registrationNumber: z.string().trim().min(2, "Registration number is required"),
  industry: z.string().trim().min(2, "Industry is required"),
  tradingName: z.string().trim().optional(),
  businessType: z.string().trim().optional(),
  taxId: z.string().trim().optional(),
  businessPhone: z.string().trim().optional(),
  website: z.string().trim().optional(),
  directorName: z.string().trim().optional(),
  bvnId: z.string().trim().optional(),
  cacDocument: z.string().trim().optional(),
  addressProof: z.string().trim().optional(),
  documentType: z.string().trim().min(2, "Document type is required"),
  referenceCode: z.string().trim().min(2, "Reference code is required"),
  notes: z.string().trim().optional(),
  consent: z.boolean().refine((value) => value, "Verification consent is required"),
})

export const onboardingSchema = baseSchema.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
  }
})

export type OnboardingValues = z.infer<typeof onboardingSchema>

export const accountSchema = baseSchema.pick({
  fullName: true,
  email: true,
  password: true,
  confirmPassword: true,
/*   agreeToTerms: true, */
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
  }
})

export const addressSchema = baseSchema.pick({
  addressLine: true,
  city: true,
  state: true,
  /* postalCode: true, */
  businessPhone: true,
  website: true,
  country: true,
})

export const businessSchema = baseSchema.pick({
  businessName: true,
  tradingName: true,
  businessType: true,
  taxId: true,
  /* website: true, */
  registrationNumber: true,
  industry: true,
})

export const verificationSchema = baseSchema.pick({
  directorName: true,
  bvnId: true,
  cacDocument: true,
  addressProof: true,
  notes: true,
  consent: true,
})

export type AccountFormValues = z.infer<typeof accountSchema>
export type AddressFormValues = z.infer<typeof addressSchema>
export type BusinessFormValues = z.infer<typeof businessSchema>
export type VerificationFormValues = z.infer<typeof verificationSchema>
