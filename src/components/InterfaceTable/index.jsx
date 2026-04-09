import React, { useState } from 'react';
import Link from '@docusaurus/Link';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const GLOSSARY_BASE = '/glossary/5g-nr';

function renderText(text) {
  if (!text || typeof text !== 'string') return text;
  const parts = text.split(/\[\[([^\]]+)\]\]/g);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (i % 2 === 0) return part || null;
    const [term, label] = part.split('|');
    return (
      <a key={i} href={`${GLOSSARY_BASE}#${slugify(term)}`} className="gl-inline-link">
        {label || term}
      </a>
    );
  });
}

function PlaneBadge({ plane }) {
  if (plane === 'both') {
    return (
      <div className="pt-planes">
        <span className="pt-badge pt-badge--control">Control</span>
        <span className="pt-badge pt-badge--user">User</span>
      </div>
    );
  }
  if (plane === 'control') return <span className="pt-badge pt-badge--control">Control</span>;
  return <span className="pt-badge pt-badge--user">User</span>;
}

function NodeBadge({ name, variant = 'ran' }) {
  return (
    <Link
      to={`${GLOSSARY_BASE}#${slugify(name)}`}
      className={`pt-endpoint pt-endpoint--${variant}`}
    >
      {name}
    </Link>
  );
}

function ProcedureRow({ proc }) {
  const [open, setOpen] = useState(false);
  const hasDetail =
    proc.dependencies ||
    proc.direction ||
    proc.messages ||
    proc.trigger ||
    proc.success ||
    proc.failure;

  return (
    <>
      <div
        className={`pt-proc-row${open ? ' pt-proc-row--expanded' : ''}${hasDetail ? ' pt-proc-row--clickable' : ''}`}
        onClick={hasDetail ? () => setOpen((v) => !v) : undefined}
        role={hasDetail ? 'button' : undefined}
        tabIndex={hasDetail ? 0 : undefined}
        onKeyDown={hasDetail ? (e) => e.key === 'Enter' && setOpen((v) => !v) : undefined}
      >
        <div className="pt-proc-row__name-cell">
          <span
            className={`pt-proc-row__chevron${open ? ' pt-proc-row__chevron--open' : ''}${!hasDetail ? ' pt-proc-row__chevron--dim' : ''}`}
          >
            ›
          </span>
          <div>
            <div className="pt-proc-row__name">{proc.name}</div>
            {proc.domain && <div className="pt-proc-row__domain">{proc.domain}</div>}
          </div>
        </div>
      </div>

      {open && (
        <div className="pt-proc-detail">
          <div className="pt-proc-detail__grid">
            {[
              { label: 'DEPENDENCIES', value: proc.dependencies },
              { label: 'DIRECTION', value: proc.direction },
              { label: 'MESSAGES', value: proc.messages },
              { label: 'TRIGGER', value: proc.trigger },
              { label: 'SUCCESS', value: proc.success },
              { label: 'FAILURE', value: proc.failure },
            ].map(({ label, value }) => (
              <div key={label} className="pt-proc-detail__item">
                <span className="pt-proc-detail__label">{label}</span>
                <span className="pt-proc-detail__value">
                  {value ? renderText(value) : <span className="pt-proc-detail__empty">—</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function InterfaceRow({ iface, expanded, onToggle }) {
  return (
    <>
      <div
        className={`it-row${expanded ? ' it-row--expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="it-row__iface">
          <span className="pt-row__icon">{iface.icon}</span>
          <div>
            <div className="pt-row__name">
              <a
                href={`${GLOSSARY_BASE}#${slugify(iface.id)}`}
                className="pt-row__name-link"
                onClick={(e) => e.stopPropagation()}
              >
                {iface.id}
              </a>
            </div>
            <div className="pt-row__fullname">{iface.fullName}</div>
          </div>
        </div>

        <div className="pt-row__cell">
          <PlaneBadge plane={iface.plane} />
        </div>

        <div className="pt-row__cell">
          <span className="pt-iface">{iface.protocol}</span>
        </div>

        <div className="it-row__nodes">
          <NodeBadge name={iface.node1} variant={iface.node1Variant || 'ran'} />
          <span className="it-arrow">→</span>
          <NodeBadge name={iface.node2} variant={iface.node2Variant || 'ran'} />
        </div>

        <div className="pt-row__cell">
          <span className="pt-unit">{iface.unit}</span>
        </div>

        <div className={`pt-row__expand-icon${expanded ? ' pt-row__expand-icon--open' : ''}`}>›</div>
      </div>

      {expanded && (
        <div className="pt-detail">
          <div className="pt-proc-table">
            <div className="pt-proc-header">
              <span>PROCEDURE</span>
            </div>
            {iface.procedures.map((proc) => (
              <ProcedureRow key={proc.name} proc={proc} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function InterfaceTable({ interfaces }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="it-table">
      <div className="it-header">
        <span>INTERFACE</span>
        <span>PLANE</span>
        <span>PROTOCOL</span>
        <span>NODES</span>
        <span>UNIT</span>
        <span />
      </div>
      {interfaces.map((iface) => (
        <InterfaceRow
          key={iface.id}
          iface={iface}
          expanded={expanded === iface.id}
          onToggle={() => setExpanded(expanded === iface.id ? null : iface.id)}
        />
      ))}
    </div>
  );
}
