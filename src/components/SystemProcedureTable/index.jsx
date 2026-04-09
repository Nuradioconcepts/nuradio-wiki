import React, { useState } from 'react';

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

function EntityBadge({ entity }) {
  return (
    <span className={`sp-entity sp-entity--${entity.variant}`}>{entity.name}</span>
  );
}

function uniqueEntities(steps) {
  const seen = new Set();
  const result = [];
  for (const s of steps) {
    for (const e of [s.from, s.to]) {
      if (e && !seen.has(e.name)) {
        seen.add(e.name);
        result.push(e);
      }
    }
  }
  return result;
}

function StepRow({ step }) {
  const sameNode = step.from.name === step.to.name;
  return (
    <div className="sp-step">
      <span className="sp-step__num">{step.step}</span>
      <span className={`sp-step__phase sp-phase--${slugify(step.phase)}`}>{step.phase}</span>
      <div className="sp-step__flow">
        <EntityBadge entity={step.from} />
        {!sameNode && (
          <>
            <span className="it-arrow">→</span>
            <EntityBadge entity={step.to} />
          </>
        )}
      </div>
      <div className="sp-step__msg">{renderText(step.message)}</div>
    </div>
  );
}

function ProcedureRow({ proc, expanded, onToggle }) {
  const entities = uniqueEntities(proc.steps);

  return (
    <>
      <div
        className={`sp-row${expanded ? ' sp-row--expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="sp-row__proc">
          <span className="pt-row__icon">{proc.icon}</span>
          <div>
            <div className="pt-row__name">{proc.name}</div>
            <div className="pt-row__fullname">{proc.spec}</div>
          </div>
        </div>

        <div className="sp-row__entities">
          {entities.map((e) => (
            <EntityBadge key={e.name} entity={e} />
          ))}
        </div>

        <div className="sp-row__steps">
          <span className="sp-step-count">{proc.steps.length}</span>
        </div>

        <div className={`pt-row__expand-icon${expanded ? ' pt-row__expand-icon--open' : ''}`}>›</div>
      </div>

      {expanded && (
        <div className="sp-detail">
          {proc.steps.map((step) => (
            <StepRow key={step.step} step={step} />
          ))}
        </div>
      )}
    </>
  );
}

export default function SystemProcedureTable({ procedures }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="sp-table">
      <div className="sp-header">
        <span>PROCEDURE</span>
        <span>ENTITIES</span>
        <span>STEPS</span>
        <span />
      </div>
      {procedures.map((proc) => (
        <ProcedureRow
          key={proc.name}
          proc={proc}
          expanded={expanded === proc.name}
          onToggle={() => setExpanded(expanded === proc.name ? null : proc.name)}
        />
      ))}
    </div>
  );
}
