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
          <p>MindTheStore.ai<br />123 Main Street, Suite 100<br />Your City, ST 00000</p>
          <div><Link href="/pricing">Pricing</Link><a href="#unsubscribe">Unsubscribe</a></div>
        </div>
      </div>
    </footer>
  )
}
