import Link from 'next/link'

const tiers = [
  {
    name: 'Free',
    price: 'Free',
    sub: null,
    detail: 'We research one niche for you and deliver it by email. No payment, no commitment — just a clear look at what\'s possible.',
    action: 'Get my free niche',
    featured: false,
  },
  {
    name: 'Single Gig',
    price: '$97',
    sub: '/month',
    detail: 'Your first gig, built and operated. Site, content, social cross-posting, monthly income report. Cancel any time — you keep the site.',
    action: 'Launch my first gig',
    featured: false,
  },
  {
    name: 'Triple Gig',
    price: '$197',
    sub: '/month',
    detail: 'Three gigs running together — the model that reaches $100/day in income you actually keep after taxes. This is the real play.',
    action: 'Go for the income goal',
    featured: true,
  },
]

export function PricingTable() {
  return (
    <section className="pricing-table" aria-label="MindTheStore pricing">
      {tiers.map((tier) => (
        <article className={tier.featured ? 'price-card featured' : 'price-card'} key={tier.name}>
          {tier.featured && <p className="price-flag">The income goal</p>}
          <p className="eyebrow">{tier.name}</p>
          <h3>{tier.price}{tier.sub && <small>{tier.sub}</small>}</h3>
          <p>{tier.detail}</p>
          <Link href="/signup">{tier.action} <span aria-hidden="true">→</span></Link>
        </article>
      ))}
    </section>
  )
}
