import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostFrontmatter {
  title: string
  subtitle?: string
  date: string
  excerpt: string
  tags: string[]
  author?: string
  heroImage?: string
}

export interface Post extends PostFrontmatter {
  slug: string
  content: string
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true })
  }
}

export function getAllPostMeta(): PostMeta[] {
  ensureBlogDir()
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.(md|mdx)$/, '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data } = matter(raw)

      return {
        slug,
        title: (data.title ?? slug).trim(),
        subtitle: data.subtitle?.trim(),
        date: data.date ?? '',
        excerpt: (data.excerpt ?? '').trim(),
        tags: (data.tags ?? []).map((t: string) => t.trim()),
        author: (data.author ?? 'MindTheStore.ai').trim(),
      } as PostMeta
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureBlogDir()
  const mdPath = path.join(BLOG_DIR, `${slug}.md`)
  const mdxPath = path.join(BLOG_DIR, `${slug}.mdx`)
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null

  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content: markdown } = matter(raw)

  const processed = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(markdown)
  const content = processed.toString()

  const heroPath = path.join(process.cwd(), 'public', 'images', 'blog', `${slug}-hero.png`)
  const heroImage = fs.existsSync(heroPath) ? `/images/blog/${slug}-hero.png` : undefined

  return {
    slug,
    title: (data.title ?? slug).trim(),
    subtitle: data.subtitle?.trim(),
    date: data.date ?? '',
    excerpt: (data.excerpt ?? '').trim(),
    tags: (data.tags ?? []).map((t: string) => t.trim()),
    author: (data.author ?? 'MindTheStore.ai').trim(),
    heroImage,
    content,
  }
}

export function getAllSlugs(): string[] {
  ensureBlogDir()
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((f) => f.replace(/\.(md|mdx)$/, ''))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
