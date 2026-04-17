import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M8 11.5L3.5 7H6V2h4v5h2.5L8 11.5z" />
      <rect x="2" y="12.5" width="12" height="1.5" rx="0.75" />
    </svg>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 16 16" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M2 2l12 12M8 3C4.5 3 1.5 8 1.5 8s.8 1.3 2.2 2.6M12.8 5.4C14.2 6.7 14.5 8 14.5 8s-3 5-6.5 5c-1.1 0-2.1-.3-3-.8" />
      <path d="M5.5 8a2.5 2.5 0 004.9-.8M8 5.5a2.5 2.5 0 012.4 3.1" />
      <line x1="2" y1="2" x2="14" y2="14" strokeWidth="1.5" stroke="currentColor" fill="none" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="currentColor" width="15" height="15" aria-hidden="true">
      <path d="M8 3C4.5 3 1.5 8 1.5 8s3 5 6.5 5 6.5-5 6.5-5S11.5 3 8 3z" />
      <circle cx="8" cy="8" r="2.25" fill="var(--lt-eye-pupil, #0a1a10)" />
    </svg>
  );
}

function LogEntryRow({ entry }) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null); // { name, url }
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasFiles = entry.files && entry.files.length > 0;
  const isSingleFile = hasFiles && entry.files.length === 1;
  const primaryFile = isSingleFile ? entry.files[0] : null;

  function openViewer(file, e) {
    e.stopPropagation();
    if (!detailOpen) setDetailOpen(true);
    if (viewingFile?.url === file.url) {
      setViewingFile(null);
      return;
    }
    setViewingFile(file);
    setFileContent(null);
    setLoading(true);
    fetch(file.url)
      .then((r) => r.text())
      .then((text) => { setFileContent(text); setLoading(false); })
      .catch(() => { setFileContent('Error loading file.'); setLoading(false); });
  }

  function handleDownload(e) {
    e.stopPropagation();
  }

  return (
    <>
      <div
        className={`lt-entry-row${detailOpen ? ' lt-entry-row--expanded' : ''} lt-entry-row--clickable`}
        onClick={() => setDetailOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setDetailOpen((v) => !v)}
      >
        <div className="lt-entry-row__name-cell">
          <span className={`lt-entry-row__chevron${detailOpen ? ' lt-entry-row__chevron--open' : ''}`}>›</span>
          <div>
            <div className="lt-entry-row__name">{entry.name}</div>
            <div className="lt-entry-row__component">{entry.component}</div>
          </div>
        </div>

        {isSingleFile && (
          <div className="lt-entry-row__actions">
            <a
              href={primaryFile.url}
              download
              className="lt-action-btn lt-action-btn--download"
              onClick={handleDownload}
              title={`Download ${primaryFile.name}`}
            >
              <DownloadIcon />
            </a>
            <button
              className={`lt-action-btn lt-action-btn--view${viewingFile?.url === primaryFile.url ? ' lt-action-btn--view-active' : ''}`}
              onClick={(e) => openViewer(primaryFile, e)}
              title={viewingFile?.url === primaryFile.url ? 'Close viewer' : 'View file'}
            >
              <EyeIcon open={viewingFile?.url === primaryFile.url} />
            </button>
          </div>
        )}

        {hasFiles && !isSingleFile && (
          <div className="lt-entry-row__actions">
            <span className="lt-file-count-badge">{entry.files.length} files</span>
          </div>
        )}
      </div>

      {detailOpen && (
        <div className="lt-entry-detail">
          <div className="lt-entry-detail__grid">
            {[
              { label: 'LOG LOCATION', value: entry.location },
              { label: 'KEY EVENTS', value: entry.keyEvents },
              { label: 'NOTES', value: entry.notes },
            ].map(({ label, value }) => (
              <div key={label} className="lt-entry-detail__item">
                <span className="lt-entry-detail__label">{label}</span>
                <span className="lt-entry-detail__value">
                  {value || <span className="lt-entry-detail__empty">—</span>}
                </span>
              </div>
            ))}
          </div>

          {hasFiles && (
            <div className="lt-files-section">
              <div className="lt-files-section__header">FILES</div>
              <div className="lt-files-list">
                {entry.files.map((f) => (
                  <div key={f.name} className="lt-file-row">
                    <span className="lt-file-row__icon">📄</span>
                    <span className="lt-file-row__name">{f.name}</span>
                    {f.size && <span className="lt-file-row__meta">{f.size}</span>}
                    {f.date && <span className="lt-file-row__meta">{f.date}</span>}
                    <button
                      className={`lt-file-row__view-btn lt-action-btn lt-action-btn--view${viewingFile?.url === f.url ? ' lt-action-btn--view-active' : ''}`}
                      onClick={(e) => openViewer(f, e)}
                      title={viewingFile?.url === f.url ? 'Close viewer' : `View ${f.name}`}
                    >
                      <EyeIcon open={viewingFile?.url === f.url} />
                    </button>
                    <a href={f.url} download className="lt-file-row__dl-link" title="Download">
                      <DownloadIcon />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hasFiles && (
            <div className="lt-files-section">
              <div className="lt-files-section__header">FILES</div>
              <div className="lt-files-empty">No files uploaded yet</div>
            </div>
          )}

          {viewingFile && (
            <div className="lt-viewer">
              <div className="lt-viewer__header">
                <span className="lt-viewer__filename">{viewingFile.name}</span>
                <button className="lt-viewer__close" onClick={(e) => { e.stopPropagation(); setViewingFile(null); }}>✕</button>
              </div>
              <div className="lt-viewer__body">
                {loading
                  ? <div className="lt-viewer__loading">Loading…</div>
                  : <pre className="lt-viewer__pre">{fileContent}</pre>
                }
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function SourceRow({ source, expanded, onToggle }) {
  return (
    <>
      <div
        className={`lt-row${expanded ? ' lt-row--expanded' : ''}`}
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      >
        <div className="lt-row__source">
          <span className="lt-row__icon">{source.icon}</span>
          <div>
            <div className="lt-row__name">{source.name}</div>
            <div className="lt-row__subtitle">{source.subtitle}</div>
          </div>
        </div>
        <div className="lt-row__cell">
          <span className="lt-type-badge">{source.type}</span>
        </div>
        <div className="lt-row__cell">
          <span className="lt-format-badge">{source.format}</span>
        </div>
        <div className={`lt-row__expand-icon${expanded ? ' lt-row__expand-icon--open' : ''}`}>›</div>
      </div>

      {expanded && (
        <div className="lt-detail">
          <div className="lt-entry-table">
            <div className="lt-entry-header">
              <span>LOG ENTRY</span>
            </div>
            {source.logs.map((entry) => (
              <LogEntryRow key={entry.name} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function LogTable({ sources }) {
  const [expanded, setExpanded] = useState(null);
  const { siteConfig: { baseUrl } } = useDocusaurusContext();
  const base = baseUrl.replace(/\/$/, '');

  // Prefix every relative file URL with the site's baseUrl so it works
  // both locally (baseUrl='/') and on GitHub Pages (baseUrl='/nuradio-wiki/')
  const resolvedSources = sources.map((source) => ({
    ...source,
    logs: source.logs.map((log) => ({
      ...log,
      files: (log.files || []).map((file) => ({
        ...file,
        url: file.url.startsWith('http') ? file.url : base + file.url,
      })),
    })),
  }));

  return (
    <div className="lt-table">
      <div className="lt-header">
        <span>SOURCE</span>
        <span>TYPE</span>
        <span>FORMAT</span>
        <span />
      </div>
      {resolvedSources.map((source) => (
        <SourceRow
          key={source.id}
          source={source}
          expanded={expanded === source.id}
          onToggle={() => setExpanded(expanded === source.id ? null : source.id)}
        />
      ))}
    </div>
  );
}
