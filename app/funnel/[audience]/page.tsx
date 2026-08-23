import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FunnelHero } from '@/components/FunnelHero'

const audiences = {
  seniors: {
    audience: 'seniors',
    funnelKey: 'seniors',
    hook: 'Turn your life experience into AI-powered side income.',
    description: 'Your perspective has value. MindTheStore helps you turn it into a small, manageable business—at a pace that makes sense for your life.',
    concern: 'You should not have to choose between extra income and your peace of mind.',
    support: 'We start with what you already know, then use practical AI support to take the complicated pieces off your plate.',
    metaTitle: 'AI Side Income for Seniors | MindTheStore.ai',
    metaDescription: 'Turn your life experience into a manageable side business with AI-powered support. No tech skills required. Start free with one niche idea.',
  },
  students: {
    audience: 'students',
    funnelKey: 'students',
    hook: 'Build a monetized micro-influencer business while you study.',
    description: 'You have fresh ideas and an audience taking shape. MTS gives you a focused way to build something real without making school take a back seat.',
    concern: 'Ambition should not require an all-or-nothing gamble.',
    support: 'Start small, validate an idea, and let AI handle the tasks that would otherwise steal your study time.',
    metaTitle: 'Build a Micro-Influencer Business in College | MindTheStore.ai',
    metaDescription: 'Start a focused micro-influencer business while you study. AI handles content, marketing, and operations so you can keep up with school.',
  },
  underemployed: {
    audience: 'underemployed adults',
    funnelKey: 'underemployed',
    hook: 'AI gives you the staff to run a business you could not run alone.',
    description: 'Your skills deserve better than being undervalued. MTS helps you package what you know into a business built around your capacity and goals.',
    concern: 'Being underpaid does not mean you are underqualified.',
    support: 'Bring your experience. We bring a practical system and AI-powered support that makes a one-person business feel possible.',
    metaTitle: 'AI-Powered Business for Underemployed Adults | MindTheStore.ai',
    metaDescription: 'Package your skills into a business you can run with AI support. Content, marketing, and operations handled by AI agents. Start free.',
  }
} as const

export function generateStaticParams() {
  return Object.keys(audiences).map((audience) => ({ audience }))
}

export function generateMetadata({ params }: { params: { audience: string } }): Metadata {
  const content = audiences[params.audience as keyof typeof audiences]
  if (!content) return {}
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: { canonical: `/funnel/${params.audience}` },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: `https://mindthestore.ai/funnel/${params.audience}`,
    },
  }
}

export default function AudiencePage({ params }: { params: { audience: string } }) {
  const content = audiences[params.audience as keyof typeof audiences]
  if (!content) notFound()
  return <FunnelHero {...content} />
}
