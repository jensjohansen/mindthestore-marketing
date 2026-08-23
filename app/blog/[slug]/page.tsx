import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllSlugs, getPostBySlug, formatDate } from '@/lib/blog'

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  if (!post) return {}

  return {
    title: `${post.title} | MindTheStore.ai`,
    description: post.excerpt,
    authors: [{ name: post.author ?? 'MindTheStore.ai' }],
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://mindthestore.ai/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author ?? 'MindTheStore.ai'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author ?? 'MindTheStore.ai' },
    publisher: { '@type': 'Organization', name: 'MindTheStore.ai', url: 'https://mindthestore.ai' },
    keywords: post.tags.join(', '),
    url: `https://mindthestore.ai/blog/${params.slug}`,
    mainEntityOfPage: `https://mindthestore.ai/blog/${params.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="blog-post-page">
        <div className="shell">
          <Link href="/blog" className="blog-back">← All articles</Link>
          <header className="blog-post-header">
            {post.tags.length > 0 && (
              <div className="blog-card-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="blog-tag">{tag}</span>
                ))}
              </div>
            )}
            <h1>{post.title}</h1>
            {post.subtitle && <p className="blog-post-subtitle">{post.subtitle}</p>}
            <div className="blog-post-meta">
              <span>{post.author ?? 'MindTheStore.ai'}</span>
              {post.date && (
                <>
                  <span aria-hidden="true">·</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </>
              )}
            </div>
          </header>
          {post.heroImage && (
            <img src={post.heroImage} alt={post.title} className="blog-post-hero" />
          )}
          <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <footer className="blog-post-footer">
            <Link href="/blog" className="text-link">Read more articles <span aria-hidden="true">→</span></Link>
            <Link href="/signup" className="blog-post-cta">Get your free niche idea <span aria-hidden="true">→</span></Link>
          </footer>
        </div>
      </article>
    </>
  )
}
