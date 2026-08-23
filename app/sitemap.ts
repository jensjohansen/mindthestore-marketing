import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mindthestore.ai'
  const lastModified = new Date()

  const staticRoutes = [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${base}/blog`, lastModified, changeFrequency: 'daily' as const, priority: 0.8 },
    { url: `${base}/funnel/seniors`, lastModified, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/funnel/students`, lastModified, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/funnel/underemployed`, lastModified, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${base}/pricing`, lastModified, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/signup`, lastModified, changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const blogRoutes = getAllSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes]
}
