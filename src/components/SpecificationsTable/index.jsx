import React, { useState, useMemo, useEffect } from 'react';
import Link from '@docusaurus/Link';

// ─── Helper: build a slug-safe anchor id from a spec id ─────────────────────
function specAnchorId(specId) {
  return `spec-${specId}`;
}

// ─── Topics pill list ────────────────────────────────────────────────────────
function TopicPills({ topics }) {
  return (
    <div className="st-topics">
      {topics.map((t) => (
        <span key={t} className="st-topic-pill">{t}</span>
      ))}
    </div>
  );
}

// ─── Related terms list ──────────────────────────────────────────────────────
function RelatedTerms({ specEntry, allTerms }) {
  const matches = useMemo(() => {
    if (!allTerms || allTerms.length === 0) return [];
    return allTerms.filter(
      (t) => t.spec && specEntry.matchSpec(t.spec)
    );
  }, [allTerms, specEntry]);

  if (matches.length === 0) return null;

  return (
    <div className="st-related">
      <span className="st-related__label">GLOSSARY TERMS</span>
      <div className="st-related__list">
        {matches.map((t) => (
          <Link
            key={`${t.glossary}-${t.id}`}
            to={`/glossary/${t.glossary}#${t.id}`}
            className="st-related-link"
          >
            <span className="st-related-link__term">{t.term}</span>
            {t.fullName && (
              <span className="st-related-link__full">{t.fullName}</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Individual spec row (expandable) ───────────────────────────────────────
function SpecRow({ spec, allTerms, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);

  return (
    <>
      <div
        id={specAnchorId(spec.id)}
        className={`st-spec-row${open ? ' st-spec-row--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      >
        <div className="st-spec-row__left">
          <span className={`st-chevron${open ? ' st-chevron--open' : ''}`}>›</span>
          <div>
            <span className="st-spec-row__number">{spec.number}</span>
            <span className="st-spec-row__title">{spec.title}</span>
          </div>
        </div>
        <span className={`st-expand-icon${open ? ' st-expand-icon--open' : ''}`}>›</span>
      </div>

      {open && (
        <div className="st-spec-detail">
          <TopicPills topics={spec.topics} />
          <RelatedTerms specEntry={spec} allTerms={allTerms} />
        </div>
      )}
    </>
  );
}

// ─── Series group (collapsible) ──────────────────────────────────────────────
function SeriesGroup({ series, allTerms, isOpen, onToggle }) {
  // Count how many terms match any spec in this series
  const termCount = useMemo(() => {
    if (!allTerms || allTerms.length === 0) return 0;
    const seen = new Set();
    series.specs.forEach((spec) => {
      allTerms.forEach((t) => {
        if (t.spec && spec.matchSpec(t.spec)) seen.add(`${t.glossary}-${t.id}`);
      });
    });
    return seen.size;
  }, [allTerms, series]);

  return (
    <>
      <div
        className={`st-series-row${isOpen ? ' st-series-row--open' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="st-series-row__left">
          <span className={`st-series-chevron${isOpen ? ' st-series-chevron--open' : ''}`}>›</span>
          <div>
            <span className="st-series-row__name">{series.name}</span>
            {series.description && (
              <span className="st-series-row__desc">{series.description}</span>
            )}
          </div>
        </div>
        <div className="st-series-row__meta">
          <span className="st-series-row__count">{series.specs.length} spec{series.specs.length !== 1 ? 's' : ''}</span>
          {termCount > 0 && (
            <span className="st-series-row__terms">{termCount} term{termCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="st-series-content">
          {series.specs.map((spec) => (
            <SpecRow key={spec.id} spec={spec} allTerms={allTerms} />
          ))}
        </div>
      )}
    </>
  );
}

// ─── Category panel ──────────────────────────────────────────────────────────
function CategoryPanel({ category, allTerms }) {
  const [openSeries, setOpenSeries] = useState(new Set());

  const toggleSeries = (id) => {
    setOpenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Listen for hash-navigation events from the parent
  useEffect(() => {
    function handler(e) {
      const { seriesId, specId } = e.detail;
      setOpenSeries((prev) => {
        const next = new Set(prev);
        next.add(seriesId);
        return next;
      });
      // After the series expands, scroll to and open the spec row
      setTimeout(() => {
        const el = document.getElementById(`spec-${specId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.click();
        }
      }, 80);
    }
    window.addEventListener('st-open-series', handler);
    return () => window.removeEventListener('st-open-series', handler);
  }, []);

  return (
    <div className="st-category-panel">
      {category.series.map((series) => (
        <SeriesGroup
          key={series.id}
          series={series}
          allTerms={allTerms}
          isOpen={openSeries.has(series.id)}
          onToggle={() => toggleSeries(series.id)}
        />
      ))}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function SpecificationsTable({ specs, allTerms = [] }) {
  const [activeCategory, setActiveCategory] = useState(specs[0]?.id ?? '');

  // On mount, check the URL hash and auto-navigate to the referenced spec
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.slice(1); // e.g. "spec-ts-38-321"
    if (!hash.startsWith('spec-')) return;

    const specId = hash.slice('spec-'.length); // e.g. "ts-38-321"

    // Find which category + series contains this spec
    for (const cat of specs) {
      for (const series of cat.series) {
        const found = series.specs.find((s) => s.id === specId);
        if (found) {
          setActiveCategory(cat.id);
          // Signal to CategoryPanel which series to open; pass via a custom event
          // so we don't need to lift state here. We use a small delay so the
          // panel has time to render before we dispatch.
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('st-open-series', { detail: { seriesId: series.id, specId } })
            );
          }, 50);
          return;
        }
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const active = specs.find((c) => c.id === activeCategory) ?? specs[0];

  return (
    <div className="st-table">
      {/* Category tab bar */}
      <div className="st-tabs" role="tablist">
        {specs.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={cat.id === activeCategory}
            className={`st-tab${cat.id === activeCategory ? ' st-tab--active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="st-tab__icon">{cat.icon}</span>
            <span className="st-tab__name">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Active category content */}
      {active && <CategoryPanel key={active.id} category={active} allTerms={allTerms} />}
    </div>
  );
}
