import { useRef, useEffect } from 'react';
import { animate, stagger } from 'animejs';

// ── SSB at subcarrier resolution ──────────────────────────────────────────────
// 240 subcarriers × 4 OFDM symbols (TS 38.211 §7.4.3)
//
// PSS/SSS: subcarriers 56–182 (127 SC) in symbols 0 and 2 respectively
// PBCH DMRS: every 4th subcarrier (v = N_ID % 4, here v=0 → 0,4,8,…,236)
//   – symbol 1 & 3: full band
//   – symbol 2: only outside SSS region (0–55 and 183–239)
//
// Stagger origin = SSS center (col 119, row 2)

const COLS = 240;
const ROWS = 4;
const V    = 0; // N_ID_cell mod 4 — DMRS subcarrier offset

function cellType(row, col) {
  const inSS = col >= 56 && col <= 182;
  const isDMRS = col % 4 === V;

  if (row === 0) return inSS ? 'pss' : 'guard';

  if (row === 2) {
    if (inSS) return 'sss';
    return isDMRS ? 'dmrs' : 'pbch';
  }

  // symbols 1 & 3 — full-band PBCH + DMRS
  return isDMRS ? 'dmrs' : 'pbch';
}

const CELLS = Array.from({ length: ROWS * COLS }, (_, i) => ({
  type: cellType(Math.floor(i / COLS), i % COLS),
}));

// Stagger origin: SSS center ≈ subcarrier 119, symbol 2
const FROM_IDX = 2 * COLS + 119;

export default function GridVis() {
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const anim = animate(el.querySelectorAll('.sg-cell'), {
      opacity: [
        { to: 0.15, duration: 800 },
        { to: 1.00, duration: 800 },
      ],
      scaleY: [
        { to: 0.70, duration: 800 },
        { to: 1.00, duration: 800 },
      ],
      delay:    stagger(10, { grid: [COLS, ROWS], from: FROM_IDX }),
      loop:     true,
      ease:     'inOutSine',
    });

    return () => anim.pause();
  }, []);

  return (
    <div className="ssb-vis" aria-hidden="true">

      {/* symbol labels + grid */}
      <div className="ssb-content">
        <div className="ssb-sym-labels">
          {['Sym 0', 'Sym 1', 'Sym 2', 'Sym 3'].map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>

        <div ref={gridRef} className="ssb-grid">
          {CELLS.map(({ type }, i) => (
            <div key={i} className={`sg-cell sg-cell--${type}`} />
          ))}
        </div>
      </div>

      {/* legend */}
      <div className="ssb-legend">
        <span className="ssb-legend__item ssb-legend__item--pss">PSS</span>
        <span className="ssb-legend__item ssb-legend__item--sss">SSS</span>
        <span className="ssb-legend__item ssb-legend__item--pbch">PBCH</span>
        <span className="ssb-legend__item ssb-legend__item--dmrs">DMRS</span>
        <span className="ssb-legend__rb">240 SC · 4 Symbols</span>
      </div>

    </div>
  );
}
