import { BusinessForm } from "@/components/onboarding/business-form"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"

export default function BusinessPage() {
  return (
    <OnboardingShell
      currentStep={2}
      totalSteps={5}
    >
      <BusinessForm />
    </OnboardingShell>
  )
}
