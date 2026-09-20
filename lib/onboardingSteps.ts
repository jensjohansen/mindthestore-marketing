export type OnboardingStep = {
  id: string
  path: string
  label: string
}

/**
 * Canonical order for the interactive account-setup flow
 * (docs/mindthestore/mindthestore-tech-design.md §9.2 popup/window UI decision).
 * Stripe first (payouts need to exist before anything else is worth building),
 * then Vercel + domain (hosting needs to exist before email can be verified
 * against a domain), then email (ImprovMX inbound + Resend outbound need the
 * domain from the previous step), then YouTube (needs a domain email to sign
 * up with), then the remaining social accounts.
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'stripe', path: '/onboarding/setup/stripe', label: 'Stripe payouts' },
  { id: 'vercel', path: '/onboarding/setup/vercel', label: 'Vercel hosting' },
  { id: 'domain', path: '/onboarding/setup/domain', label: 'Domain' },
  { id: 'email', path: '/onboarding/setup/email', label: 'Email' },
  { id: 'youtube', path: '/onboarding/setup/youtube', label: 'YouTube' },
  { id: 'social', path: '/onboarding/setup/social', label: 'Social accounts' },
]

export function getStepNav(id: string): { index: number; prev: OnboardingStep | null; next: OnboardingStep | null } {
  const index = ONBOARDING_STEPS.findIndex((s) => s.id === id)
  return {
    index,
    prev: index > 0 ? ONBOARDING_STEPS[index - 1] : null,
    next: index >= 0 && index < ONBOARDING_STEPS.length - 1 ? ONBOARDING_STEPS[index + 1] : null,
  }
}
