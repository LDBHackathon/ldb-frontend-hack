import { AddressForm } from "@/components/onboarding/address-form"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"

export default function AddressPage() {
  return (
    <OnboardingShell
      currentStep={3}
      totalSteps={5}
    >
      <AddressForm />
    </OnboardingShell>
  )
}
