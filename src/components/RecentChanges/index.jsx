import React from 'react';
import Link from '@docusaurus/Link';
import changes from '../../data/recentChanges.json';

const SECTION_COLORS = {
  'Dashboard':        'var(--rc-section--dashboard)',
  '5G NR':            'var(--rc-section--5gnr)',
  'O-RAN':            'var(--rc-section--oran)',
  'Glossary':         'var(--rc-section--glossary)',
  'Packet Analysis':  'var(--rc-section--packet)',
  'Resources':        'var(--rc-section--resources)',
  'Computer Systems': 'var(--rc-section--cs)',
};

function formatDate(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date} · ${time}`;
}

function SectionBadge({ section }) {
  const color = SECTION_COLORS[section] || 'var(--rc-section--default)';
  return (
    <span className="rc-section-badge" style={{ '--rc-color': color }}>
      {section}
    </span>
  );
}

export default function RecentChanges() {
  if (!changes || changes.length === 0) {
    return (
      <div className="rc-empty">No recent changes recorded yet — rebuild to populate.</div>
    );
  }

  return (
    <div className="rc-table">
      <div className="rc-header">
        <span>PAGE</span>
        <span>FILE PATH</span>
        <span>SECTION</span>
        <span>LAST MODIFIED</span>
      </div>
      {changes.map((entry, i) => (
        <Link key={i} to={entry.route} className="rc-row">
          <span className="rc-row__title">{entry.title}</span>
          <span className="rc-row__filepath">{entry.filepath}</span>
          <span className="rc-row__section">
            <SectionBadge section={entry.section} />
          </span>
          <span className="rc-row__time">{formatDate(entry.mtime)}</span>
        </Link>
      ))}
      <div className="rc-footer">Showing {changes.length} most recent changes · updates on rebuild</div>
    </div>
  );
}
