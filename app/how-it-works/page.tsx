import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works | MindTheStore.ai',
  description: 'Understand the micro-influencer income model — how YouTube channels, affiliate marketing, and AI-assisted content generation build real, lasting side-gig income.',
  alternates: { canonical: '/how-it-works' },
  openGraph: {
    title: 'How It Works | MindTheStore.ai',
    description: 'The honest guide to building micro-influencer income that survives algorithm changes and actually clears taxes.',
    url: 'https://mindthestore.ai/how-it-works',
  },
}

export default function HowItWorksPage() {
  return (
    <main className="hiw-page">

      <section className="hiw-hero shell">
        <p className="eyebrow">The full picture, plainly stated</p>
        <h1>How a micro-influencer<br />business actually works</h1>
        <p className="lede">Not a funnel. Not passive income magic. A real explanation of how content channels earn money, why AI slop fails, and what the honest path to $100 a day looks like.</p>
      </section>

      <section className="hiw-section shell">
        <div className="hiw-number">01</div>
        <div className="hiw-body">
          <h2>What a micro-influencer business is</h2>
          <p>A micro-influencer owns a small media operation in a specific niche — a YouTube channel, a blog, maybe a newsletter. The audience is modest: a few thousand people who care deeply about one topic. That specificity is the asset.</p>
          <p>Income comes from three directions at once:</p>
          <ul>
            <li><strong>Platform monetization</strong> — YouTube pays ad revenue once a channel hits 1,000 subscribers and 4,000 watch hours. Small channels earn real money; the audience focus means higher CPMs than mass-appeal content.</li>
            <li><strong>Affiliate marketing</strong> — Every piece of content recommends relevant products with tracked links. When a reader or viewer buys, you earn a commission. Amazon Associates, ShareASale, and niche programs all pay 4–20% on sales.</li>
            <li><strong>Sponsored content and digital products</strong> — Once an audience trusts a channel, brands pay for placements. Courses, guides, and templates are straightforward to add and keep earning.</li>
          </ul>
          <p>These three income streams compound. A $50 YouTube payout plus $120 in affiliate commissions plus occasional sponsorships adds up faster than a single fragile stream.</p>
        </div>
      </section>

      <section className="hiw-section shell hiw-alt">
        <div className="hiw-number">02</div>
        <div className="hiw-body">
          <h2>Why AI slop fails — and what we do differently</h2>
          <p>The internet is full of AI content businesses right now. Virtually all of them are failing, or about to. Here is why.</p>
          <p>Automated AI publishing farms produce hundreds of articles or videos a week with no human editorial judgment. For six to eighteen months, this can look like growth. Then the platforms notice.</p>
          <p>YouTube, Google, and every major social platform has one goal: keep people on the platform. AI-generated content that sounds authoritative but says nothing original drives viewers away. The algorithms are tuned to detect and deprioritize it. When they act, a channel that took months to build disappears from recommendations overnight.</p>
          <p>The businesses selling &ldquo;AI content at scale&rdquo; have a 2% success rate. The 98% lose their channels and their investment.</p>
          <div className="hiw-callout">
            <strong>The MTS difference: the human approval gate.</strong>
            <p>Every piece of content MTS generates goes through a human review step before it touches a live channel. You see it. You approve it or you send it back. Nothing goes live without your say-so.</p>
            <p>This is not a formality. It is the structural protection that keeps your channel alive. An AI that generates content for a human who reviews it is creating assisted human content. That is what the platforms reward. That is what builds an audience that stays.</p>
          </div>
        </div>
      </section>

      <section className="hiw-section shell">
        <div className="hiw-number">03</div>
        <div className="hiw-body">
          <h2>The tax reality, stated plainly</h2>
          <p>Side income is taxed harder than employment income. This surprises most new earners, and it has ended more side gigs than any algorithm change.</p>
          <p>When you earn money as a self-employed person or a sole proprietor, you pay:</p>
          <ul>
            <li><strong>Federal income tax</strong> — your marginal rate on the net profit</li>
            <li><strong>Self-employment tax</strong> — 15.3% on net profit (Social Security and Medicare that an employer would otherwise split with you)</li>
            <li><strong>State income tax</strong> — varies, but often 5–10%</li>
          </ul>
          <p>A back-of-envelope estimate: on a modest side income, the combined rate runs 35–50%. To keep $100 a day, you need to earn $150–200 a day gross.</p>
          <div className="hiw-callout">
            <strong>Why we recommend three gigs, not one.</strong>
            <p>One niche earning $50/day in affiliate commissions is fragile and the net might be $25–30 after taxes. Three niches each earning $50–75/day gets you to gross income that nets $100 after taxes — and the risk is spread across three independent channels. If one platform adjusts its algorithm, two businesses keep running.</p>
            <p>We are not tax lawyers. We strongly recommend consulting a CPA once income becomes meaningful. What we <em>can</em> do is help you structure your business so there is income worth having a conversation about.</p>
          </div>
        </div>
      </section>

      <section className="hiw-section shell hiw-alt">
        <div className="hiw-number">04</div>
        <div className="hiw-body">
          <h2>What MTS actually does for you</h2>
          <p>MTS is an AI operations service, not a content farm. Here is the work we do, step by step.</p>
          <ol className="hiw-steps">
            <li>
              <strong>Niche research.</strong> Our AI agents research the topic landscape, competition, monetization potential, and audience size. You get a clear report on whether an idea is worth pursuing before you spend a dollar.
            </li>
            <li>
              <strong>Niche selection.</strong> We make sure the niches we suggest for you do not compete with each other and fit your personal background or interest. A niche you care about produces better content and lasts longer.
            </li>
            <li>
              <strong>Site and channel setup.</strong> We register your domain, set up your blog on Vercel, and scaffold your YouTube channel. Everything is registered in your name and transferred to your ownership. You own the asset from day one.
            </li>
            <li>
              <strong>Content generation and review.</strong> AI agents draft articles, video scripts, and social posts. You review each one and approve or request changes. Approved content publishes; everything else stays in the queue.
            </li>
            <li>
              <strong>Cross-posting.</strong> Long-form content seeds shorter posts across platforms — LinkedIn, X, Facebook, Instagram — automatically. Your presence grows without you manually reposting everything.
            </li>
            <li>
              <strong>Monthly income reporting.</strong> You receive a plain-language report each month: what earned, what did not, what to focus on next. No dashboards to interpret, no jargon.
            </li>
          </ol>
        </div>
      </section>

      <section className="hiw-section shell">
        <div className="hiw-number">05</div>
        <div className="hiw-body">
          <h2>Realistic timelines</h2>
          <p>Anyone who promises income in 30 days is selling something that does not work. Here is what realistic progress looks like.</p>
          <div className="hiw-timeline">
            <div className="hiw-milestone">
              <span className="hiw-month">Month 1–2</span>
              <p>Site live, first 10 articles published, YouTube channel created. You are in the approval workflow. Zero income — content is indexing and the channel is building watch hours.</p>
            </div>
            <div className="hiw-milestone">
              <span className="hiw-month">Month 3–4</span>
              <p>First affiliate commissions. Small amounts — $10–50/month depending on niche and traffic. YouTube still below monetization threshold for most channels. This is normal.</p>
            </div>
            <div className="hiw-milestone">
              <span className="hiw-month">Month 6</span>
              <p>Established channels with consistent output begin hitting 1,000 subscribers. Affiliate income grows as Google indexes more content. Some niches reach $100–300/month gross in this window.</p>
            </div>
            <div className="hiw-milestone">
              <span className="hiw-month">Month 9–12</span>
              <p>YouTube monetization active. Three-gig customers in this range start seeing combined income that meaningfully supplements employment income. Not $100/day — but building toward it.</p>
            </div>
            <div className="hiw-milestone">
              <span className="hiw-month">Year 2+</span>
              <p>Compounding. Channels with an established audience earn more per video. Affiliate content that ranks in search earns passively. The work shifts from building to maintaining and improving.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hiw-cta shell">
        <h2>Start with the free niche report</h2>
        <p>You get a fully researched niche idea delivered by email — no payment, no commitment. If it looks worth pursuing, the path forward is clear. If not, you have learned something useful for free.</p>
        <div className="hiw-cta-buttons">
          <Link href="/signup" className="btn-primary-link">Get my free niche idea <span aria-hidden="true">→</span></Link>
          <Link href="/pricing" className="btn-secondary-link">See pricing →</Link>
        </div>
      </section>

    </main>
  )
}
