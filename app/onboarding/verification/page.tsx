import { VerificationForm } from "@/components/onboarding/verification-form"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"

export default function VerificationPage() {
    return (
        <OnboardingShell currentStep={4} totalSteps={5}>
            <VerificationForm />
        </OnboardingShell>
    )
}
