import React, { useState, useEffect, useMemo } from 'react';
import Link from '@docusaurus/Link';

function TypeBadge({ type }) {
  const cls = type.toLowerCase().replace(/[\s'/]+/g, '-');
  return <span className={`gl-badge gl-badge--${cls}`}>{type}</span>;
}

function GlossaryTermRow({ entry }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        id={entry.id}
        className={`gl-term-row${open ? ' gl-term-row--expanded' : ''}`}
        onClick={() => setOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((v) => !v)}
      >
        <div className="gl-term-row__term">
          <span className={`gl-chevron${open ? ' gl-chevron--open' : ''}`}>›</span>
          <div>
            <div className="gl-term-row__abbr">{entry.term}</div>
            {entry.fullName && (
              <div className="gl-term-row__full">{entry.fullName}</div>
            )}
          </div>
        </div>
        <div className="gl-term-row__type">
          <TypeBadge type={entry.type} />
        </div>
        <div className="gl-term-row__layer">{entry.layer || '—'}</div>
        <span className={`gl-expand-icon${open ? ' gl-expand-icon--open' : ''}`}>›</span>
      </div>

      {open && (
        <div className="gl-detail">
          <div className="gl-detail__grid">
            <div className="gl-detail__item gl-detail__item--wide">
              <span className="gl-detail__label">DEFINITION</span>
              <span className="gl-detail__value">{entry.definition}</span>
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

function GlossaryFooter({ entries }) {
  const typeCounts = useMemo(() => {
    const counts = {};
    entries.forEach(({ type }) => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [entries]);

  return (
    <div className="gl-footer">
      <div className="gl-footer__total">
        <span className="gl-footer__total-number">{entries.length}</span>
        <span className="gl-footer__total-label">total terms</span>
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

  const [openLetters, setOpenLetters] = useState(new Set());

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
      <div className="gl-header">
        <span>TERM</span>
        <span>TYPE</span>
        <span>LAYER / DOMAIN</span>
        <span />
      </div>
      {sortedKeys.map((letter) => (
        <LetterGroup
          key={letter}
          letter={letter}
          entries={groups[letter]}
          isOpen={openLetters.has(letter)}
          onToggle={() => toggleLetter(letter)}
        />
      ))}
      <GlossaryFooter entries={entries} />
    </div>
  );
}
