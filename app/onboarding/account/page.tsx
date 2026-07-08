import { AccountForm } from "@/components/onboarding/account-form"
import { OnboardingShell } from "@/components/onboarding/onboarding-shell"

export default function AccountPage() {
    return (
        <OnboardingShell currentStep={1} totalSteps={5}>
            <AccountForm />
        </OnboardingShell>
    )
}
