import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://mindthestore.ai'
  const lastModified = new Date()

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/funnel/seniors`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/funnel/students`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/funnel/underemployed`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/signup`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
