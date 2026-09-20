import type { Metadata } from 'next'
import { NicheQuestionnaireForm } from '@/components/NicheQuestionnaireForm'

export const metadata: Metadata = {
  title: 'Get Your Free Niche Report | MindTheStore.ai',
  description: 'Answer four quick questions and we\u2019ll research one focused, practical niche for you \u2014 free, no payment required.',
  alternates: { canonical: '/free-niche' },
  openGraph: {
    title: 'Get Your Free Niche Report | MindTheStore.ai',
    description: 'Four quick questions. One real, researched niche idea. No payment required.',
    url: 'https://mindthestore.ai/free-niche',
  },
}

export default function FreeNichePage({ searchParams }: { searchParams: { email?: string; source?: string } }) {
  const prefillEmail = typeof searchParams.email === 'string' ? searchParams.email : ''
  const funnelOrigin = typeof searchParams.source === 'string' && searchParams.source.length > 0 ? searchParams.source : 'direct'

  return (
    <main className="niche-page">
      <div className="shell niche-grid">
        <div className="niche-intro">
          <p className="eyebrow">Free, no payment required</p>
          <h1>Tell us about you.<br />We&rsquo;ll research the niche.</h1>
          <p className="lede">
            Four short questions. We&rsquo;ll use them to research one focused, practical niche you could actually
            start &mdash; not a generic list, a real recommendation matched to you.
          </p>
        </div>
        <div className="niche-card">
          <NicheQuestionnaireForm prefillEmail={prefillEmail} funnelOrigin={funnelOrigin} />
        </div>
      </div>
    </main>
  )
}
