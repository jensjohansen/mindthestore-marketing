'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="wordmark" href="/" onClick={() => setOpen(false)} aria-label="MindTheStore.ai home">
          <span className="mark" aria-hidden="true"><i /><i /><i /></span>
          <span>MindTheStore<span>.ai</span></span>
        </Link>
        <button className="menu-button" type="button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>
          <span className="sr-only">{open ? 'Close' : 'Open'} navigation menu</span>
          <span aria-hidden="true">{open ? '×' : '☰'}</span>
        </button>
        <nav id="site-navigation" className={open ? 'nav-links is-open' : 'nav-links'} aria-label="Main navigation">
          <Link href="/#find-your-path" onClick={() => setOpen(false)}>Find your path</Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
          <Link className="nav-cta" href="/signup" onClick={() => setOpen(false)}>Start free <span aria-hidden="true">→</span></Link>
        </nav>
      </div>
    </header>
  )
}
