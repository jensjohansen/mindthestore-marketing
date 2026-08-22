import Link from 'next/link'

const paths = [
  { number: '01', name: 'I have experience', audience: 'Seniors, 55–75', copy: 'Turn what you know into extra income, without turning your life upside down.', href: '/funnel/seniors', accent: 'amber' },
  { number: '02', name: 'I have momentum', audience: 'Students, 18–30', copy: 'Build a focused business around your point of view while you study.', href: '/funnel/students', accent: 'mint' },
  { number: '03', name: 'I am ready for more', audience: 'Adults, 30–55', copy: 'Use your skills to build the work and earning power you deserve.', href: '/funnel/underemployed', accent: 'blue' }
]

export default function HomePage() {
  return (
    <>
      <section className="home-hero"><div className="shell home-hero-inner"><p className="eyebrow light">A practical guide to your next thing</p><h1>Make your<br /><em>idea</em> work harder.</h1><p className="hero-copy">MindTheStore.ai gives you AI-powered guidance to turn your experience, energy, or expertise into a small business that fits your life.</p><a className="text-link light" href="#find-your-path">Find your starting point <span aria-hidden="true">↓</span></a><div className="hero-orbit" aria-hidden="true"><span className="orbit-center">your<br />idea</span><i>learn</i><i>build</i><i>grow</i></div></div></section>
      <section id="find-your-path" className="path-section"><div className="shell"><div className="path-heading"><p className="section-number">01 / Choose your doorway</p><h2>You&apos;re starting<br />somewhere real.</h2><p>Different life stages. The same possibility: building something that belongs to you.</p></div><div className="path-list">{paths.map((path) => <Link className={`path-row ${path.accent}`} href={path.href} key={path.number}><span className="path-number">{path.number}</span><div><p className="path-audience">{path.audience}</p><h3>{path.name}</h3></div><p className="path-copy">{path.copy}</p><span className="arrow" aria-hidden="true">→</span></Link>)}</div></div></section>
      <section className="promise-section"><div className="shell promise-grid"><div><p className="section-number">02 / What we believe</p><h2>No hype.<br />Just a helpful<br /><em>next step.</em></h2></div><div className="promise-points"><p><b>01</b> You do not need to become a different person to start a business.</p><p><b>02</b> AI is most useful when it gives you room to be more human.</p><p><b>03</b> Small, sustainable work can build real independence.</p><Link className="text-link" href="/signup">Get your free starting idea <span aria-hidden="true">→</span></Link></div></div></section>
    </>
  )
}
