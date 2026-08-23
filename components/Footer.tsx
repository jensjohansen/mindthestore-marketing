import Link from 'next/link'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <div className="wordmark footer-mark"><span className="mark" aria-hidden="true"><i /><i /><i /></span><span>MindTheStore<span>.ai</span></span></div>
          <p>Small ideas deserve steady support.</p>
        </div>
        <div className="footer-details">
          <div><Link href="/how-it-works">How it works</Link><Link href="/blog">Blog</Link><Link href="/pricing">Pricing</Link><a href="mailto:hello@mindthestore.ai">Contact</a></div>
        </div>
      </div>
    </footer>
  )
}
