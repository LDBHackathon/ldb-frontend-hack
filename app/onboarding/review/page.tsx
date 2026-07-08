import { OnboardingShell } from "@/components/onboarding/onboarding-shell"
import ReviewPage from "@/components/onboarding/review"

export default function VerificationPage() {
    return (
        <OnboardingShell currentStep={5} totalSteps={5}>
            <ReviewPage />
        </OnboardingShell>
    )
}
