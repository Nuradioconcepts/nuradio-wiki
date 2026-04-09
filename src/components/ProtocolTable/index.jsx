import React, { useState } from 'react';
import Link from '@docusaurus/Link';

// Normalize a term string to a URL-safe anchor id
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

const GLOSSARY_BASE = '/glossary/5g-nr';

// Parse [[term]] or [[term|label]] syntax into React nodes with glossary links
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

function EndpointBadge({ name, variant = 'ran' }) {
  return (
    <Link
      to={`${GLOSSARY_BASE}#${slugify(name)}`}
      className={`pt-endpoint pt-endpoint--${variant}`}
    >
      {name}
    </Link>
  );
}

function IfaceBadge({ name }) {
  return (
    <Link to={`${GLOSSARY_BASE}#${slugify(name)}`} className="pt-iface">
      {name}
    </Link>
  );
}

function UnitBadge({ name }) {
  return <span className="pt-unit">{name}</span>;
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
            <div className="pt-proc-row__domain">{proc.domain}</div>
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

function ProtocolRow({ proto, expanded, onToggle }) {
  // Protocols with dedicated glossary entries
  const linkedProtos = new Set(['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SDAP']);

  return (
    <>
      <div
        className={`pt-row${expanded ? ' pt-row--expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="pt-row__protocol">
          <span className="pt-row__icon">{proto.icon}</span>
          <div>
            {linkedProtos.has(proto.id) ? (
              <a
                href={`${GLOSSARY_BASE}#${slugify(proto.id)}`}
                className="pt-row__name pt-row__name-link"
                onClick={(e) => e.stopPropagation()}
              >
                {proto.id}
              </a>
            ) : (
              <div className="pt-row__name">{proto.id}</div>
            )}
            <div className="pt-row__fullname">{proto.fullName}</div>
          </div>
        </div>

        <div className="pt-row__cell">
          <PlaneBadge plane={proto.plane} />
        </div>

        <div className="pt-row__cell pt-row__cell--endpoints">
          {proto.endpoints.map((ep) => (
            <EndpointBadge key={ep.name} name={ep.name} variant={ep.variant} />
          ))}
        </div>

        <div className="pt-row__cell">
          {proto.interfaces.map((i) => (
            <IfaceBadge key={i} name={i} />
          ))}
        </div>

        <div className="pt-row__cell">
          <UnitBadge name={proto.unit} />
        </div>

        <div className={`pt-row__expand-icon${expanded ? ' pt-row__expand-icon--open' : ''}`}>›</div>
      </div>

      {expanded && (
        <div className="pt-detail">
          <div className="pt-proc-table">
            <div className="pt-proc-header">
              <span>PROCEDURE</span>
            </div>
            {proto.procedures.map((proc) => (
              <ProcedureRow key={proc.name} proc={proc} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function ProtocolTable({ protocols }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="pt-table">
      <div className="pt-header">
        <span>PROTOCOL</span>
        <span>PLANE</span>
        <span>ENDPOINT</span>
        <span>INTERFACE</span>
        <span>UNIT</span>
        <span />
      </div>
      {protocols.map((proto) => (
        <ProtocolRow
          key={proto.id}
          proto={proto}
          expanded={expanded === proto.id}
          onToggle={() => setExpanded(expanded === proto.id ? null : proto.id)}
        />
      ))}
    </div>
  );
}
