import React, { useState, useEffect, useMemo } from 'react';
import Link from '@docusaurus/Link';

function TypeBadge({ type }) {
  const cls = type.toLowerCase().replace(/[\s'/]+/g, '-');
  return <span className={`gl-badge gl-badge--${cls}`}>{type}</span>;
}

// Highlight the first occurrence of `query` inside `text`
function Highlight({ text, query }) {
  if (!text || !query) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="gl-highlight">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function GlossaryTermRow({ entry, query = '' }) {
  const [open, setOpen] = useState(false);

  // Auto-expand rows when a search is active
  const isSearching = query.length > 0;

  return (
    <>
      <div
        id={entry.id}
        className={`gl-term-row${open || isSearching ? ' gl-term-row--expanded' : ''}`}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      >
        <div className="gl-term-row__term">
          <span className={`gl-chevron${open || isSearching ? ' gl-chevron--open' : ''}`}>›</span>
          <div>
            <div className="gl-term-row__abbr">
              <Highlight text={entry.term} query={query} />
            </div>
            {entry.fullName && (
              <div className="gl-term-row__full">
                <Highlight text={entry.fullName} query={query} />
              </div>
            )}
          </div>
        </div>
        <div className="gl-term-row__type">
          <TypeBadge type={entry.type} />
        </div>
        <div className="gl-term-row__layer">{entry.layer || '—'}</div>
        <span className={`gl-expand-icon${open || isSearching ? ' gl-expand-icon--open' : ''}`}>›</span>
      </div>

      {(open || isSearching) && (
        <div className="gl-detail">
          <div className="gl-detail__grid">
            <div className="gl-detail__item gl-detail__item--wide">
              <span className="gl-detail__label">DEFINITION</span>
              <span className="gl-detail__value">
                <Highlight text={entry.definition} query={query} />
              </span>
            </div>
            {entry.related && entry.related.length > 0 && (
              <div className="gl-detail__item">
                <span className="gl-detail__label">RELATED TERMS</span>
                <div className="gl-detail__related">
                  {entry.related.map((r) => (
                    <Link
                      key={r}
                      to={`#${r.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                      className="gl-related-link"
                    >
                      {r}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {entry.spec && (
              <div className="gl-detail__item">
                <span className="gl-detail__label">SPEC REFERENCE</span>
                <span className="gl-detail__value">{entry.spec}</span>
              </div>
            )}
            {entry.configParams && (
              <div className="gl-detail__item gl-detail__item--wide">
                <span className="gl-detail__label">CONFIGURATION PARAMETERS</span>
                <pre className="gl-detail__code"><code>{entry.configParams}</code></pre>
              </div>
            )}
            {entry.logReference && (
              <div className="gl-detail__item gl-detail__item--wide">
                <span className="gl-detail__label">LOG REFERENCE</span>
                <pre className="gl-detail__code"><code>{entry.logReference}</code></pre>
              </div>
            )}
            {entry.packetCapture && (
              <div className="gl-detail__item gl-detail__item--wide">
                <span className="gl-detail__label">PACKET CAPTURE</span>
                <pre className="gl-detail__code"><code>{entry.packetCapture}</code></pre>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function LetterGroup({ letter, entries, isOpen, onToggle }) {
  return (
    <>
      <div
        className={`gl-letter-row${isOpen ? ' gl-letter-row--open' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <span className="gl-letter">{letter}</span>
        <span className="gl-letter-count">{entries.length}</span>
        <span className={`gl-letter-chevron${isOpen ? ' gl-letter-chevron--open' : ''}`}>›</span>
      </div>
      {isOpen &&
        entries.map((entry) => <GlossaryTermRow key={entry.id} entry={entry} />)}
    </>
  );
}

function GlossaryFooter({ entries, filtered }) {
  const displayEntries = filtered ?? entries;

  const typeCounts = useMemo(() => {
    const counts = {};
    displayEntries.forEach(({ type }) => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [displayEntries]);

  return (
    <div className="gl-footer">
      <div className="gl-footer__total">
        <span className="gl-footer__total-number">{displayEntries.length}</span>
        <span className="gl-footer__total-label">
          {filtered ? 'results' : 'total terms'}
        </span>
      </div>
      <div className="gl-footer__breakdown">
        {typeCounts.map(([type, count]) => (
          <span key={type} className="gl-footer__type-pill">
            <TypeBadge type={type} />
            <span className="gl-footer__type-count">{count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function GlossaryTable({ entries }) {
  const [query, setQuery]         = useState('');
  const [openLetters, setOpenLetters] = useState(new Set());

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.term.localeCompare(b.term)),
    [entries]
  );

  const { groups, idToLetter } = useMemo(() => {
    const g = {};
    const idMap = {};
    sorted.forEach((entry) => {
      const first = entry.term[0].toUpperCase();
      const key = /[0-9]/.test(first) ? '#' : first;
      if (!g[key]) g[key] = [];
      g[key].push(entry);
      idMap[entry.id] = key;
    });
    return { groups: g, idToLetter: idMap };
  }, [sorted]);

  // Filtered results — null means "no search active"
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return sorted.filter(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        (e.fullName    && e.fullName.toLowerCase().includes(q)) ||
        (e.definition  && e.definition.toLowerCase().includes(q)) ||
        (e.type        && e.type.toLowerCase().includes(q)) ||
        (e.layer       && e.layer.toLowerCase().includes(q))
    );
  }, [query, sorted]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.slice(1);
    if (hash && idToLetter[hash]) {
      setOpenLetters(new Set([idToLetter[hash]]));
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleLetter = (letter) => {
    setOpenLetters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });
  };

  const sortedKeys = Object.keys(groups).sort((a, b) => {
    if (a === '#') return -1;
    if (b === '#') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="gl-table">

      {/* Search bar */}
      <div className="gl-search">
        <span className="gl-search__icon">⌕</span>
        <input
          type="search"
          className="gl-search__input"
          placeholder="Search terms, definitions, types…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          autoComplete="off"
        />
        {filtered !== null && (
          <span className="gl-search__count">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Column headers */}
      <div className="gl-header">
        <span>TERM</span>
        <span>TYPE</span>
        <span>LAYER / DOMAIN</span>
        <span />
      </div>

      {/* Content */}
      {filtered !== null ? (
        filtered.length > 0 ? (
          filtered.map((entry) => (
            <GlossaryTermRow key={entry.id} entry={entry} query={query.trim()} />
          ))
        ) : (
          <div className="gl-search__empty">
            No terms match <strong>"{query}"</strong>
          </div>
        )
      ) : (
        sortedKeys.map((letter) => (
          <LetterGroup
            key={letter}
            letter={letter}
            entries={groups[letter]}
            isOpen={openLetters.has(letter)}
            onToggle={() => toggleLetter(letter)}
          />
        ))
      )}

      <GlossaryFooter entries={entries} filtered={filtered} />
    </div>
  );
}
