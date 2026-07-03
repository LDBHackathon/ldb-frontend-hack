import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { AccountFormValues, AddressFormValues, BusinessFormValues, VerificationFormValues } from "@/lib/onboarding-schema"

export type { AccountFormValues, AddressFormValues, BusinessFormValues, VerificationFormValues } from "@/lib/onboarding-schema"

export interface OnboardingData {
  account?: AccountFormValues
  address?: AddressFormValues
  business?: BusinessFormValues
  verification?: VerificationFormValues
}

interface OnboardingStore {
  data: OnboardingData
  hasHydrated: boolean
  setStepData: (step: keyof OnboardingData, values: AccountFormValues | AddressFormValues | BusinessFormValues | VerificationFormValues) => void
  reset: () => void
  setHasHydrated: (value: boolean) => void
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      data: {},
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      setStepData: (step, values) =>
        set((state) => ({
          data: {
            ...state.data,
            [step]: values,
          },
        })),
      reset: () => set({ data: {}, hasHydrated: false }),
    }),
    {
      name: "onboarding-store",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
