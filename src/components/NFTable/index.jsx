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

function NFRow({ nf, expanded, onToggle }) {
  return (
    <>
      <div
        className={`nf-row${expanded ? ' nf-row--expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="nf-row__nf">
          <span className="pt-row__icon">{nf.icon}</span>
          <div>
            <div className="pt-row__name">
              <a
                href={`${GLOSSARY_BASE}#${slugify(nf.id)}`}
                className="pt-row__name-link"
                onClick={(e) => e.stopPropagation()}
              >
                {nf.id}
              </a>
            </div>
            <div className="pt-row__fullname">{nf.fullName}</div>
          </div>
        </div>

        <div className="pt-row__cell">
          <span className="pt-iface">{nf.sbi}</span>
        </div>

        <div className="nf-row__interfaces">
          {nf.cpInterfaces.map((i) => (
            <span key={i} className="pt-iface">{i}</span>
          ))}
        </div>

        <div className="nf-row__interfaces">
          {nf.upInterfaces.length > 0 ? (
            nf.upInterfaces.map((i) => (
              <span key={i} className="pt-iface">{i}</span>
            ))
          ) : (
            <span className="pt-proc-detail__empty">—</span>
          )}
        </div>

        <div className="nf-row__protocols">
          {nf.protocols.map((p) => (
            <span key={p} className="pt-unit">{p}</span>
          ))}
        </div>

        <div className={`pt-row__expand-icon${expanded ? ' pt-row__expand-icon--open' : ''}`}>›</div>
      </div>

      {expanded && (
        <div className="pt-detail">
          <div className="pt-proc-table">
            <div className="pt-proc-header">
              <span>PROCEDURE</span>
            </div>
            {nf.procedures.map((proc) => (
              <ProcedureRow key={proc.name} proc={proc} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function NFTable({ nfs }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="nf-table">
      <div className="nf-header">
        <span>NF</span>
        <span>SBI</span>
        <span>CP INTERFACES</span>
        <span>UP INTERFACES</span>
        <span>PROTOCOLS</span>
        <span />
      </div>
      {nfs.map((nf) => (
        <NFRow
          key={nf.id}
          nf={nf}
          expanded={expanded === nf.id}
          onToggle={() => setExpanded(expanded === nf.id ? null : nf.id)}
        />
      ))}
    </div>
  );
}
