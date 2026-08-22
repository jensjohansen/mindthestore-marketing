import Link from 'next/link'

const tiers = [
  { name: 'Freemium', price: 'Free', detail: 'One focused niche idea, delivered by email.', action: 'Start free', featured: false },
  { name: 'Niche', price: '$20', detail: 'One niche, or choose three for $50.', action: 'Explore a niche', featured: false },
  { name: 'Build', price: '$100', detail: 'One launch-ready gig, or three for $200–$250.', action: 'Build my gig', featured: true },
  { name: 'Operate', price: '$99', detail: 'Monthly support to keep your business moving.', action: 'Keep operating', featured: false }
]

export function PricingTable() {
  return (
    <section className="pricing-table" aria-label="MindTheStore pricing">
      {tiers.map((tier) => (
        <article className={tier.featured ? 'price-card featured' : 'price-card'} key={tier.name}>
          {tier.featured && <p className="price-flag">Most momentum</p>}
          <p className="eyebrow">{tier.name}</p>
          <h3>{tier.price}{tier.name === 'Operate' && <small>/month</small>}</h3>
          <p>{tier.detail}</p>
          <Link href="/signup">{tier.action} <span aria-hidden="true">→</span></Link>
        </article>
      ))}
    </section>
  )
}
