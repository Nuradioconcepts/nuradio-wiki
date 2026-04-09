import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import data from '@site/src/data/siteHealth.json';

function StatPill({ icon, value, label, variant = 'default' }) {
  return (
    <div className={`sh-stat sh-stat--${variant}`}>
      <span className="sh-stat__icon">{icon}</span>
      <span className="sh-stat__value">{value}</span>
      <span className="sh-stat__label">{label}</span>
    </div>
  );
}

export default function SiteHealth() {
  const [orphansOpen, setOrphansOpen] = useState(false);
  const { totalPages, totalLinks, orphanPages } = data;
  const hasOrphans = orphanPages.length > 0;

  return (
    <div className="sh-widget">
      <div className="sh-widget__header">
        <span className="sh-widget__title">Site Health</span>
        <span className="sh-widget__subtitle">auto-updated on every build</span>
      </div>

      <div className="sh-stats">
        <StatPill icon="📄" value={totalPages}  label="pages"  variant="default" />
        <StatPill icon="🔗" value={totalLinks}  label="links"  variant="default" />
        <StatPill
          icon={hasOrphans ? '⚠️' : '✓'}
          value={orphanPages.length}
          label="orphan pages"
          variant={hasOrphans ? 'warn' : 'ok'}
        />
      </div>

      {hasOrphans && (
        <div className="sh-orphans">
          <button
            className="sh-orphans__toggle"
            onClick={() => setOrphansOpen((v) => !v)}
          >
            <span className={`sh-orphans__chevron${orphansOpen ? ' sh-orphans__chevron--open' : ''}`}>›</span>
            <span>
              {orphanPages.length} page{orphanPages.length !== 1 ? 's' : ''} with no incoming links
            </span>
          </button>

          {orphansOpen && (
            <div className="sh-orphans__list">
              {orphanPages.map((p) => (
                <Link key={p.route} to={p.route} className="sh-orphan-row">
                  <span className="sh-orphan-row__title">{p.title.replace(/\s*🚧\s*$/, '')}</span>
                  <span className="sh-orphan-row__route">{p.route}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
