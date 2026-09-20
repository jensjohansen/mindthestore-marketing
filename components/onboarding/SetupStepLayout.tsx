import Link from 'next/link'
import { ONBOARDING_STEPS, getStepNav } from '@/lib/onboardingSteps'

type SetupStepLayoutProps = {
  stepId: string
  eyebrow: string
  title: string
  subtitle: string
  left: React.ReactNode
  right: React.ReactNode
}

export function SetupStepLayout({ stepId, eyebrow, title, subtitle, left, right }: SetupStepLayoutProps) {
  const { index, prev, next } = getStepNav(stepId)

  return (
    <main className="setup-page">
      <section className="setup-progress shell">
        <ol className="setup-progress-list">
          {ONBOARDING_STEPS.map((step, i) => (
            <li
              key={step.id}
              className={
                step.id === stepId
                  ? 'setup-progress-step is-current'
                  : i < index
                    ? 'setup-progress-step is-done'
                    : 'setup-progress-step'
              }
            >
              {i < index ? (
                <Link href={step.path}>{step.label}</Link>
              ) : (
                <span>{step.label}</span>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="setup-hero shell">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lede">{subtitle}</p>
      </section>

      <section className="setup-grid shell">
        <div className="setup-left">{left}</div>
        <div className="setup-right">{right}</div>
      </section>

      <section className="setup-nav shell">
        {prev ? (
          <Link href={prev.path} className="btn-secondary-link">← Back: {prev.label}</Link>
        ) : (
          <Link href="/onboarding/accounts" className="btn-secondary-link">← Back to checklist overview</Link>
        )}
        {next ? (
          <Link href={next.path} className="btn-primary-link">Next: {next.label} →</Link>
        ) : (
          <Link href="/onboarding/accounts" className="btn-primary-link">Done — back to checklist →</Link>
        )}
      </section>
    </main>
  )
}
