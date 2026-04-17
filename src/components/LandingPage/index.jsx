import React from 'react';
import Link from '@docusaurus/Link';
import GridVis from '@site/src/components/GridVis';
import SiteHealth from '@site/src/components/SiteHealth';
import RecentChanges from '@site/src/components/RecentChanges';

/* ── Card data ─────────────────────────────────────────────────────────── */
const STACK = [
  {
    to: '/5g-nr',
    icon: '📡',
    label: '5G NR',
    sub: 'System architecture · air interface · standards',
    desc: 'Architecture, air interface, data encapsulation, and layer-by-layer procedures for the 5G New Radio standard.',
  },
  {
    to: '/o-ran',
    icon: '🔗',
    label: 'O-RAN',
    sub: 'Open RAN · CU / DU / RU · interfaces',
    desc: 'Open RAN architecture, interfaces, protocols, and hardware decomposition across CU, DU, and RU.',
  },
  {
    to: '/packet-analysis',
    icon: '🔬',
    label: 'Packet Analysis',
    sub: 'Capture · dissect · analyze',
    desc: 'Capture methodology, protocol field references, Wireshark tips, and troubleshooting guides.',
  },
  {
    to: '/resources',
    icon: '📚',
    label: 'Resources',
    sub: 'Specs · projects · references',
    desc: 'Specifications, O-RAN Alliance docs, open-source projects, and curated external references.',
  },
];

/* ── Main component ────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="lp">

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="lp__hero">
        <div className="lp__hero-text">
          <span className="lp__eyebrow">Everything Decoded</span>
          <h1 className="lp__h1">
            Understand complex<br />
            systems with{' '}
            <span className="lp__accent">clarity.</span>
          </h1>
          <p className="lp__lead">
            Your living reference for 5G&nbsp;NR, O-RAN, computer systems,
            and packet analysis.
          </p>
          <div className="lp__ctas">
            <Link to="/5g-nr"     className="lp__btn lp__btn--solid">Explore the Atlas</Link>
            <Link to="/resources" className="lp__btn lp__btn--ghost">View All Sections</Link>
          </div>
        </div>
        <div className="lp__hero-vis">
          <div className="lp__hero-icon-wrap">
            <img
              src="/img/atlas-glow.png"
              alt="nuradio atlas"
              className="lp__hero-icon"
            />
          </div>
        </div>
      </section>

      {/* ─── EXPLORE THE STACK ──────────────────────────────────────── */}
      <section className="lp__stack">
        <div className="lp__stack-hdr">
          <h2>Explore the Stack</h2>
          <p>Dive into the core domains of modern communication systems</p>
        </div>
        <div className="lp__stack-grid">
          {STACK.map(({ to, icon, label, sub, desc }) => (
            <Link key={to} to={to} className="lp__card">
              <div className="lp__card-top">
                <span className="lp__card-icon">{icon}</span>
                <strong className="lp__card-label">{label}</strong>
              </div>
              <span   className="lp__card-sub">{sub}</span>
              <p      className="lp__card-desc">{desc}</p>
              <span   className="lp__card-cta">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── PITCH ──────────────────────────────────────────────────── */}
      <section className="lp__pitch">
        <div className="lp__pitch-text">
          <h2>
            Built for engineers<br />
            who want{' '}
            <span className="lp__accent">clarity.</span>
          </h2>
          <ul className="lp__bullets">
            <li>Layer-by-layer explanations</li>
            <li>Real protocol design</li>
            <li>Practical debugging context</li>
          </ul>
        </div>
        <div className="lp__pitch-vis" aria-hidden="true">
          <GridVis />
        </div>
      </section>

      {/* ─── DASHBOARD METRICS ──────────────────────────────────────── */}
      <section className="lp__metrics">
        <SiteHealth />
        <RecentChanges />
      </section>

    </div>
  );
}
