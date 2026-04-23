import React, { useState, useMemo } from 'react';

const COLUMNS = [
  { key: 'arfcn',            label: 'ARFCN',              numeric: true },
  { key: 'gscn',             label: 'GSCN',               numeric: true },
  { key: 'band',             label: 'Band',               numeric: false },
  { key: 'freq',             label: 'Freq (MHz)',          numeric: true },
  { key: 'bw',               label: 'BW (MHz)',            numeric: true },
  { key: 'scs',              label: 'SCS (kHz)',           numeric: true },
  { key: 'rbBw',             label: 'RB BW',              numeric: true },
  { key: 'ssbBw',            label: 'SSB BW',             numeric: true },
  { key: 'ssbStart',         label: 'SSB Start (MHz)',    numeric: true },
  { key: 'pointAOffset',     label: 'PointA Offset',      numeric: true },
  { key: 'pointAOffsetFreq', label: 'PointA Offset Freq', numeric: true },
  { key: 'scOffset',         label: 'SC Offset',          numeric: true },
  { key: 'scOffsetFreq',     label: 'SC Offset Freq',     numeric: true },
  { key: 'totalOffset',      label: 'Total Offset',       numeric: true },
  { key: 'carrierStart',     label: 'Carrier Start',      numeric: true },
  { key: 'carrierCenter',    label: 'Carrier Center',     numeric: true },
  { key: 'carrierStop',      label: 'Carrier Stop',       numeric: true },
  { key: 'carrierStopFreq',  label: 'Carrier Stop (MHz)', numeric: true },
];

function SortIcon({ direction }) {
  if (!direction) return <span className="nrch-sort-icon nrch-sort-icon--none">⇅</span>;
  return (
    <span className="nrch-sort-icon nrch-sort-icon--active">
      {direction === 'asc' ? '↑' : '↓'}
    </span>
  );
}

export default function NRChannelsTable({ channels }) {
  const [sortKey, setSortKey] = useState('arfcn');
  const [sortDir, setSortDir] = useState('asc');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  const sorted = useMemo(() => {
    const col = COLUMNS.find(c => c.key === sortKey);
    return [...channels].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const an = av === '' || av == null ? null : Number(av);
      const bn = bv === '' || bv == null ? null : Number(bv);
      let cmp;
      if (col?.numeric && an != null && bn != null) {
        cmp = an - bn;
      } else if (an == null && bn != null) {
        cmp = 1;
      } else if (an != null && bn == null) {
        cmp = -1;
      } else {
        cmp = String(av ?? '').localeCompare(String(bv ?? ''));
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [channels, sortKey, sortDir]);

  return (
    <div className="nrch-wrapper">
      <div className="nrch-scroll">
        <table className="nrch-table">
          <thead>
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`nrch-th${sortKey === col.key ? ' nrch-th--active' : ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="nrch-th-inner">
                    {col.label}
                    <SortIcon direction={sortKey === col.key ? sortDir : null} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => (
              <tr key={i} className="nrch-row">
                {COLUMNS.map(col => (
                  <td key={col.key} className={`nrch-td${col.numeric ? ' nrch-td--num' : ''}`}>
                    {row[col.key] === '' || row[col.key] == null ? '' : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
