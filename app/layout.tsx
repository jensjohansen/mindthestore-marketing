import type { Metadata } from 'next'
import './globals.css'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

const siteUrl = 'https://mindthestore.ai'

export const metadata: Metadata = {
  title: 'MindTheStore.ai | Make your idea work harder',
  description: 'Practical AI guidance for building a small business that fits your life. Turn your experience, energy, or expertise into income with AI-powered support.',
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'MindTheStore.ai | Make your idea work harder',
    description: 'Practical AI guidance for building a small business that fits your life.',
    url: siteUrl,
    siteName: 'MindTheStore.ai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindTheStore.ai | Make your idea work harder',
    description: 'Practical AI guidance for building a small business that fits your life.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  themeColor: '#092a3a',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MindTheStore',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MindTheStore.ai',
  url: 'https://mindthestore.ai',
  description: 'AI-powered guidance for building a small business that fits your life.',
  slogan: 'Make your idea work harder.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
