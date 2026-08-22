import Link from 'next/link'
import { EmailSignup } from './EmailSignup'

type FunnelHeroProps = {
  audience: string
  hook: string
  description: string
  concern: string
  support: string
}

const stages = [
  ['01', 'Freemium', 'Find one idea worth trying'],
  ['02', 'Niche', 'Choose the right audience'],
  ['03', 'Build', 'Shape an offer that sells'],
  ['04', 'Operate', 'Keep the work moving']
]

export function FunnelHero({ audience, hook, description, concern, support }: FunnelHeroProps) {
  return (
    <>
      <section className="funnel-hero">
        <div className="shell funnel-hero-grid">
          <div className="funnel-intro">
            <p className="eyebrow">For {audience}</p>
            <h1>{hook}</h1>
            <p className="lede">{description}</p>
            <EmailSignup source={audience.toLowerCase()} />
          </div>
          <aside className="idea-board" aria-label="A small idea can grow into an operating business">
            <p className="idea-label">The MTS path</p>
            <div className="idea-line" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="idea-origin"><span className="spark" aria-hidden="true">✦</span><strong>One small<br />idea</strong></div>
            <div className="idea-destination"><span className="store-icon" aria-hidden="true">⌂</span><strong>Operating<br />business</strong></div>
            <p className="idea-caption">A clear next step, then another.</p>
          </aside>
        </div>
      </section>
      <section className="acknowledgement shell">
        <p className="section-number">01 / You&apos;re not behind</p>
        <div><h2>{concern}</h2><p>{support}</p></div>
      </section>
      <section className="journey-section">
        <div className="shell"><p className="section-number">02 / Your service ladder</p><div className="journey-heading"><h2>From first thought<br />to steady rhythm.</h2><p>Choose the amount of support that matches where you are today. Every step leaves you with something useful.</p></div><ol className="journey-list">{stages.map(([number, name, detail]) => <li key={name}><span>{number}</span><h3>{name}</h3><p>{detail}</p><b aria-hidden="true">↗</b></li>)}</ol></div>
      </section>
      <section className="proof-section shell">
        <div className="proof-copy"><p className="section-number">03 / Real momentum, in real life</p><h2>Proof is personal.</h2><p>We&apos;re building a library of stories from people who made their expertise work in a new way.</p><Link href="/pricing">See the simple pricing <span aria-hidden="true">→</span></Link></div>
        <div className="testimonial-placeholder"><span className="quote-mark" aria-hidden="true">“</span><p>Member story coming soon</p><small>A practical win from the MTS community</small></div>
      </section>
      <section className="video-section"><div className="shell video-grid"><div><p className="section-number">04 / See the method</p><h2>Quiet guidance.<br />Clear action.</h2><p>A short introduction to how MTS turns a spark of experience into work you can actually manage.</p></div><div className="video-placeholder" role="img" aria-label="Video placeholder: Watch how MindTheStore works"><span className="play-button" aria-hidden="true">▶</span><p>Watch: an idea, in motion</p><small>2 minutes · Video coming soon</small></div></div></section>
    </>
  )
}
