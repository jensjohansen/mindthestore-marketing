import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPostMeta, formatDate } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog | MindTheStore.ai',
  description: 'Practical advice on building and running side gigs with AI. Niche research, content strategy, and honest reporting on what works.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog | MindTheStore.ai',
    description: 'Practical advice on building and running side gigs with AI.',
    url: 'https://mindthestore.ai/blog',
    type: 'website',
  },
}

export default function BlogPage() {
  const posts = getAllPostMeta()

  return (
    <section className="blog-page">
      <div className="shell">
        <p className="eyebrow">MTS Blog</p>
        <h1>Build smarter.<br /><em>Side gig insights.</em></h1>
        <p className="blog-lede">Practical advice on building and running side gigs with AI. We share what works, what doesn&apos;t, and what we learn running our own AI-powered business.</p>

        {posts.length === 0 ? (
          <div className="blog-empty">
            <p className="blog-empty-title">Articles coming soon</p>
            <p className="blog-empty-text">We&apos;re writing our first articles now. <Link href="/signup">Get your free niche idea</Link> while you wait.</p>
          </div>
        ) : (
          <div className="blog-list">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
                <time className="blog-card-date" dateTime={post.date}>{formatDate(post.date)}</time>
                <h2 className="blog-card-title">{post.title}</h2>
                {post.subtitle && <p className="blog-card-subtitle">{post.subtitle}</p>}
                <p className="blog-card-excerpt">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className="blog-card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                  </div>
                )}
                <span className="blog-card-cta">Read article <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        )}

        <div className="blog-cta">
          <p>Ready to start?</p>
          <Link className="text-link" href="/signup">Get your free niche idea <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </section>
  )
}
