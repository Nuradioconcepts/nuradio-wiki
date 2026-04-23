import React, { useRef, useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { nrChannelsData } from '@site/src/data/nrChannels';

const COLORS = ['#33ff33','#00ccff','#ff6633','#ffcc00','#ff33ff','#66ff99','#ff9966','#33cccc','#cc99ff','#ff6699','#99ff33','#ffaa00','#3399ff'];
const NPTS = 800;
const WF_ROWS = 60;

// Map nrChannels fields to analyzer fields.
// carrierCenter = left edge, carrierStop = center freq, carrierStopFreq = right edge
const ALL_CH = nrChannelsData.map((ch, i) => ({
  id: i,
  arfcn: ch.arfcn,
  gscn: ch.gscn,
  band: ch.band,
  freq: ch.freq,
  bw: ch.bw,
  scs: ch.scs / 1000,
  rb: ch.rbBw,
  ssbBw: ch.ssbBw,
  ssbStart: ch.ssbStart,
  cs: ch.carrierCenter,
  cc: ch.carrierStop,
  ce: ch.carrierStopFreq,
}));

const BAND_GROUPS = {
  'n71 (600)':     ch => ch.band.includes('71'),
  'n5/n26 (850)':  ch => ch.band.includes('850'),
  'n2/n25 (1900)': ch => ch.band.includes('1900'),
  'n70 (AWS4)':    ch => ch.band.includes('70'),
  'n66 (AWS)':     ch => ch.band.includes('66'),
  'n41 (2500)':    ch => ch.band.includes('41'),
  'n77 (C-band)':  ch => ch.band.includes('77'),
};

const SEEDS = (() => {
  const r = [];
  for (let i = 0; i < 32; i++) {
    const h = Array.from({length: 6}, () => ({
      f: 0.3 + Math.random() * 1.8, a: 1.5 + Math.random() * 3.5,
      p: Math.random() * Math.PI * 2, s: 0.4 + Math.random() * 1.2,
    }));
    r.push({h, ns: 0.5 + Math.random() * 1.5});
  }
  return r;
})();

function defaultSpan(band) {
  const chs = ALL_CH.filter(BAND_GROUPS[band] || (() => false));
  if (!chs.length) return {start: 600, stop: 700};
  return {
    start: Math.min(...chs.map(c => c.cs)) - 2,
    stop:  Math.max(...chs.map(c => c.ce)) + 2,
  };
}

// ── styles ──────────────────────────────────────────────────────────────────
const S = {
  root:   {background:'#0e0e0e',color:'#ccc',fontFamily:"'Courier New',Consolas,monospace",padding:'10px',borderRadius:'10px',border:'1px solid #333',fontSize:'11px'},
  row:    {display:'flex',flexWrap:'wrap',gap:'6px',marginBottom:'6px',alignItems:'center'},
  group:  {display:'flex',alignItems:'center',gap:'4px',background:'#111',border:'1px solid #222',borderRadius:'4px',padding:'3px 6px'},
  label:  {fontSize:'10px',color:'#777',whiteSpace:'nowrap'},
  unit:   {fontSize:'10px',color:'#555'},
  input:  {width:'68px',background:'#0a0a0a',border:'1px solid #333',color:'#33ff33',fontFamily:'inherit',fontSize:'11px',padding:'2px 4px',borderRadius:'3px',textAlign:'right'},
  select: {background:'#0a0a0a',border:'1px solid #333',color:'#33ff33',fontFamily:'inherit',fontSize:'10px',padding:'2px',borderRadius:'3px'},
  btn:    {padding:'3px 8px',fontSize:'10px',cursor:'pointer',borderRadius:'4px',background:'#1a1a1a',border:'1px solid #333',color:'#aaa',fontFamily:'inherit'},
  btnOn:  {background:'#1a3a2a',color:'#33ff33',border:'1px solid #33ff33'},
  chkLbl: {fontSize:'10px',color:'#aaa',display:'flex',alignItems:'center',gap:'3px',cursor:'pointer'},
  thCell: {textAlign:'left',color:'#33ff33',fontWeight:500,padding:'2px 6px',borderBottom:'1px solid #2a2a2a',fontSize:'9px',background:'#111'},
  tdCell: {padding:'2px 6px',borderBottom:'1px solid #1a1a1a',fontSize:'10px',color:'#bbb'},
};

function Btn({active, onClick, children, style}) {
  return <button onClick={onClick} style={{...S.btn, ...(active ? S.btnOn : {}), ...style}}>{children}</button>;
}
function Grp({label, children}) {
  return <div style={S.group}><label style={S.label}>{label}:</label>{children}</div>;
}

// ── main component ───────────────────────────────────────────────────────────
function SpectrumAnalyzerInner() {
  const canRef  = useRef(null);
  const wfRef   = useRef(null);
  const rafRef  = useRef(null);
  const tRef    = useRef(0);
  const frameRef = useRef(0);

  // All values the draw loop reads live — avoids stale closures
  const C = useRef({
    refLvl: -10, dbDiv: 10, atten: 0, rbwSel: 100,
    showSSB: true, showPointA: true, showCtr: true,
    band: 'n71 (600)',
  });
  const viewRef     = useRef({start: 622, stop: 645});
  const traceModeRef = useRef('cw');
  const hiddenRef   = useRef(new Set());
  const markersRef  = useRef([]);
  const maxH = useRef(new Float32Array(NPTS).fill(-200));
  const minH = useRef(new Float32Array(NPTS).fill(200));
  const avgB = useRef(new Float32Array(NPTS).fill(-90));
  const avgN = useRef(0);
  const wfData = useRef([]);

  // React state — only what drives JSX re-renders
  const [band, setBand]           = useState('n71 (600)');
  const [traceMode, setTraceMode] = useState('cw');
  const [hiddenVer, setHiddenVer] = useState(0);
  const [markers, setMarkers]     = useState([]);
  const [refLvl, setRefLvl]       = useState(-10);
  const [dbDiv, setDbDiv]         = useState(10);
  const [atten, setAtten]         = useState(0);
  const [rbwSel, setRbwSel]       = useState(100);
  const [viewStart, setViewStart] = useState(622);
  const [viewStop, setViewStop]   = useState(645);
  const [showSSB, setShowSSB]     = useState(true);
  const [showPointA, setShowPointA] = useState(true);
  const [showCtr, setShowCtr]     = useState(true);

  const modeDisp = `RBW: ${rbwSel} kHz | REF: ${refLvl} dBm | ATTEN: ${atten} dB | ${traceMode.toUpperCase()}`;

  function resetTraces() {
    maxH.current.fill(-200);
    minH.current.fill(200);
    avgB.current.fill(-90);
    avgN.current = 0;
    wfData.current = [];
  }

  function applyView(start, stop) {
    const s = Math.min(start, stop - 0.1);
    const e = Math.max(stop, start + 0.1);
    viewRef.current = {start: s, stop: e};
    setViewStart(+s.toFixed(2));
    setViewStop(+e.toFixed(2));
    resetTraces();
  }

  function applyFullSpan(b) {
    const {start, stop} = defaultSpan(b || C.current.band);
    applyView(start, stop);
  }

  // Init span on mount
  useEffect(() => { applyFullSpan('n71 (600)'); }, []);

  function sigLevel(freq, t) {
    const {refLvl: ref, atten: att, band: b} = C.current;
    const nf = ref - 70 - att;
    let lvl = nf + (Math.random() - 0.5) * 3;
    const chs = ALL_CH.filter(BAND_GROUPS[b] || (() => false));
    for (const ch of chs) {
      if (hiddenRef.current.has(ch.id)) continue;
      if (freq >= ch.cs && freq <= ch.ce) {
        const seed = SEEDS[ch.id % SEEDS.length];
        const norm = (freq - ch.cs) / (ch.ce - ch.cs);
        const ef = Math.min(1, Math.min(norm, 1 - norm) * 2 * 6);
        let wave = 0;
        for (const h of seed.h) wave += Math.sin(freq * h.f + t * h.s + h.p) * h.a;
        wave += (Math.sin(freq * 4.1 + t * 2.3) * 0.8 + Math.sin(freq * 7.3 + t * 3.1) * 0.5) * seed.ns;
        lvl = (ref - 10 - att) + wave * ef * 0.35 + (Math.random() - 0.5) * 1.5;
      }
    }
    return lvl;
  }

  // Animation loop
  useEffect(() => {
    const can  = canRef.current;
    const wfCan = wfRef.current;
    if (!can || !wfCan) return;
    const dpr = window.devicePixelRatio || 1;

    function resize(c, h) {
      const w = c.parentElement.getBoundingClientRect().width;
      c.width = w * dpr; c.height = h * dpr; c.style.height = h + 'px';
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function px(f, ml, pw, vs, ve) { return ml + (f - vs) / (ve - vs) * pw; }
    function cy(y, top, ph) { return Math.max(top, Math.min(top + ph, y)); }

    function drawWF(trace) {
      resize(wfCan, 100);
      const W = wfCan.width / dpr;
      wfData.current.unshift(trace.slice());
      if (wfData.current.length > WF_ROWS) wfData.current.length = WF_ROWS;
      const {refLvl: ref, atten: att} = C.current;
      const nf = ref - 70 - att;
      const wc = wfCan.getContext('2d');
      wc.fillStyle = '#0a0a0a'; wc.fillRect(0, 0, W, 100);
      const rh = 100 / WF_ROWS, cw = W / NPTS;
      for (let r = 0; r < wfData.current.length; r++) {
        for (let i = 0; i < wfData.current[r].length; i++) {
          const v = Math.max(0, Math.min(1, (wfData.current[r][i] - nf) / (ref - nf)));
          wc.fillStyle = `hsl(${240 - v * 240},100%,${Math.round(15 + v * 50)}%)`;
          wc.fillRect(i * cw, r * rh, cw + 0.5, rh + 0.5);
        }
      }
    }

    function draw(ts) {
      tRef.current = (ts || 0) * 0.001;
      const t = tRef.current;
      frameRef.current++;

      resize(can, 360);
      const W = can.width / dpr, H = 360;
      const M = {top: 28, right: 16, bottom: 44, left: 52};
      const pw = W - M.left - M.right, ph = H - M.top - M.bottom;
      const {refLvl: ref, dbDiv: dbd, atten: att, showSSB, showPointA, showCtr, band: b} = C.current;
      const totalDb = dbd * 8;
      const {start: vs, stop: ve} = viewRef.current;
      const span = ve - vs;
      const trMode = traceModeRef.current;
      const allChs = ALL_CH.filter(BAND_GROUPS[b] || (() => false));

      const fy = lvl => M.top + ((ref - lvl) / totalDb) * ph;
      const ctx = can.getContext('2d');
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, W, H);

      // Grid
      ctx.strokeStyle = '#1a2a1a'; ctx.lineWidth = 0.5;
      for (let i = 0; i <= 8; i++) { const y = M.top + (i / 8) * ph; ctx.beginPath(); ctx.moveTo(M.left, y); ctx.lineTo(M.left + pw, y); ctx.stroke(); }
      const fStep = span > 200 ? 20 : span > 50 ? 10 : span > 20 ? 5 : span > 5 ? 1 : 0.5;
      const fgStart = Math.ceil(vs / fStep) * fStep;
      for (let f = fgStart; f <= ve; f += fStep) { const x = px(f, M.left, pw, vs, ve); ctx.beginPath(); ctx.moveTo(x, M.top); ctx.lineTo(x, M.top + ph); ctx.stroke(); }
      ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.strokeRect(M.left, M.top, pw, ph);

      // Channel overlays
      allChs.forEach((ch, ci) => {
        const col = COLORS[ci % COLORS.length];
        const x1 = px(ch.cs, M.left, pw, vs, ve), x2 = px(ch.ce, M.left, pw, vs, ve);
        if (x2 < M.left || x1 > M.left + pw) return;
        if (hiddenRef.current.has(ch.id)) { ctx.fillStyle = col + '06'; ctx.fillRect(Math.max(x1, M.left), M.top, Math.min(x2, M.left + pw) - Math.max(x1, M.left), ph); return; }
        if (showSSB) {
          const s1 = px(ch.ssbStart, M.left, pw, vs, ve), s2 = px(ch.ssbStart + ch.ssbBw, M.left, pw, vs, ve);
          ctx.fillStyle = '#ff336622'; ctx.fillRect(s1, M.top, s2 - s1, ph);
          ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 0.8; ctx.setLineDash([3, 3]); ctx.strokeRect(s1, M.top, s2 - s1, ph); ctx.setLineDash([]);
        }
        if (showPointA) {
          const ppx = px(ch.cs, M.left, pw, vs, ve);
          ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 0.8; ctx.setLineDash([2, 2]); ctx.beginPath(); ctx.moveTo(ppx, M.top); ctx.lineTo(ppx, M.top + ph); ctx.stroke(); ctx.setLineDash([]);
        }
        if (showCtr) {
          const cpx = px(ch.cc, M.left, pw, vs, ve);
          ctx.strokeStyle = '#ffffff33'; ctx.lineWidth = 0.5; ctx.setLineDash([1, 3]); ctx.beginPath(); ctx.moveTo(cpx, M.top); ctx.lineTo(cpx, M.top + ph); ctx.stroke(); ctx.setLineDash([]);
        }
        if (x2 - x1 > 40) {
          ctx.fillStyle = col; ctx.font = '500 9px monospace'; ctx.textAlign = 'center';
          ctx.fillText(ch.bw + ' MHz', (x1 + x2) / 2, M.top + 12);
          ctx.fillStyle = '#777'; ctx.font = '8px monospace';
          ctx.fillText('ARFCN ' + ch.arfcn, (x1 + x2) / 2, M.top + 22);
        }
      });

      // Build trace
      const cur = new Float32Array(NPTS);
      for (let i = 0; i < NPTS; i++) cur[i] = sigLevel(vs + span * i / NPTS, t);

      for (let i = 0; i < NPTS; i++) {
        if (cur[i] > maxH.current[i]) maxH.current[i] = cur[i];
        if (cur[i] < minH.current[i]) minH.current[i] = cur[i];
        avgN.current++;
        avgB.current[i] += (cur[i] - avgB.current[i]) / Math.min(avgN.current, 60);
      }

      const disp = trMode === 'max' ? maxH.current : trMode === 'min' ? minH.current : trMode === 'avg' ? avgB.current : cur;

      // Ghost max hold in CW mode
      if (trMode === 'cw' && avgN.current > 2) {
        ctx.strokeStyle = '#ffcc0033'; ctx.lineWidth = 0.5; ctx.beginPath();
        for (let i = 0; i < NPTS; i++) { const x = M.left + i * pw / NPTS, y = cy(fy(maxH.current[i]), M.top, ph); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
      }

      ctx.save(); ctx.beginPath(); ctx.rect(M.left, M.top, pw, ph); ctx.clip();

      const grad = ctx.createLinearGradient(0, M.top, 0, M.top + ph);
      grad.addColorStop(0, '#33ff3318'); grad.addColorStop(0.5, '#33ff330a'); grad.addColorStop(1, '#33ff3302');
      ctx.beginPath(); ctx.moveTo(M.left, M.top + ph);
      for (let i = 0; i < NPTS; i++) ctx.lineTo(M.left + i * pw / NPTS, cy(fy(disp[i]), M.top, ph));
      ctx.lineTo(M.left + pw, M.top + ph); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

      ctx.beginPath();
      for (let i = 0; i < NPTS; i++) { const x = M.left + i * pw / NPTS, y = cy(fy(disp[i]), M.top, ph); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = trMode === 'max' ? '#ffcc00' : trMode === 'min' ? '#00ccff' : trMode === 'avg' ? '#ff33ff' : '#33ff33';
      ctx.lineWidth = 1.2; ctx.stroke();
      ctx.restore();

      // Markers
      const mkrs = markersRef.current;
      mkrs.forEach(m => {
        m.lvl = sigLevel(m.freq, t);
        const mx2 = px(m.freq, M.left, pw, vs, ve), my = cy(fy(m.lvl), M.top, ph);
        if (mx2 >= M.left && mx2 <= M.left + pw) {
          ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(mx2 - 6, my); ctx.lineTo(mx2 + 6, my); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(mx2, my - 6); ctx.lineTo(mx2, my + 6); ctx.stroke();
          ctx.fillStyle = '#ffcc00'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'center'; ctx.fillText(m.label, mx2, my - 9);
          ctx.fillStyle = '#ccc'; ctx.font = '8px monospace';
          ctx.fillText(m.freq.toFixed(2) + ' MHz', mx2, my + 16);
          ctx.fillText(m.lvl.toFixed(1) + ' dBm', mx2, my + 24);
        }
      });

      // Axes
      ctx.fillStyle = '#777'; ctx.font = '10px monospace'; ctx.textAlign = 'center';
      for (let f = fgStart; f <= ve; f += fStep) ctx.fillText(f.toFixed(span < 10 ? 2 : span < 50 ? 1 : 0), px(f, M.left, pw, vs, ve), M.top + ph + 14);
      ctx.fillText('Frequency (MHz)', M.left + pw / 2, H - 4);
      ctx.textAlign = 'right'; ctx.fillStyle = '#555'; ctx.font = '9px monospace';
      for (let i = 0; i <= 8; i++) ctx.fillText((ref - i * dbd).toFixed(0), M.left - 4, M.top + (i / 8) * ph + 3);
      ctx.save(); ctx.translate(10, M.top + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillStyle = '#777'; ctx.font = '9px monospace'; ctx.textAlign = 'center'; ctx.fillText('dBm', 0, 0); ctx.restore();

      drawWF(disp);

      // Throttle marker table updates to ~2 Hz
      if (mkrs.length > 0 && frameRef.current % 30 === 0) setMarkers([...mkrs]);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  // ── event handlers ────────────────────────────────────────────────────────
  function handleBand(e) {
    const b = e.target.value;
    C.current.band = b; setBand(b);
    hiddenRef.current.clear(); setHiddenVer(v => v + 1);
    applyFullSpan(b);
  }

  function handleCanvasClick(e) {
    const rect = canRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const ml = 52, pw = rect.width - 52 - 16;
    if (mx < ml || mx > ml + pw) return;
    const {start: vs, stop: ve} = viewRef.current;
    const freq = vs + (mx - ml) / pw * (ve - vs);
    const lvl = sigLevel(freq, tRef.current);
    if (markersRef.current.length < 6) {
      markersRef.current.push({freq, lvl, label: 'M' + (markersRef.current.length + 1)});
      setMarkers([...markersRef.current]);
    }
  }

  function peakSearch() {
    const {start: vs, stop: ve} = viewRef.current;
    const span = ve - vs;
    let best = -999, bf = vs;
    for (let i = 0; i < 200; i++) { const f = vs + span * i / 200; const l = sigLevel(f, tRef.current); if (l > best) { best = l; bf = f; } }
    markersRef.current.push({freq: bf, lvl: best, label: 'Pk' + (markersRef.current.length + 1)});
    setMarkers([...markersRef.current]);
  }

  function nextPeak() {
    if (!markersRef.current.length) return;
    const {start: vs, stop: ve} = viewRef.current;
    const span = ve - vs;
    const last = markersRef.current[markersRef.current.length - 1];
    let best = -999, bf = vs;
    for (let i = 0; i < 400; i++) {
      const f = vs + span * i / 400;
      if (Math.abs(f - last.freq) < span * 0.02) continue;
      const l = sigLevel(f, tRef.current);
      if (l > best) { best = l; bf = f; }
    }
    markersRef.current.push({freq: bf, lvl: best, label: 'Pk' + (markersRef.current.length + 1)});
    setMarkers([...markersRef.current]);
  }

  function setMode(mode) {
    traceModeRef.current = mode; setTraceMode(mode); resetTraces();
  }

  const bandChs = ALL_CH.filter(BAND_GROUPS[band] || (() => false));
  const center  = ((viewStart + viewStop) / 2).toFixed(2);
  const spanVal = (viewStop - viewStart).toFixed(2);

  return (
    <div style={S.root}>
      {/* Header */}
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'2px 0 6px',borderBottom:'1px solid #222',marginBottom:'6px'}}>
        <span style={{color:'#33ff33',fontSize:'13px',fontWeight:500,letterSpacing:'1px'}}>5G NR SPECTRUM ANALYZER</span>
        <span style={{color:'#888',fontSize:'10px'}}>{modeDisp}</span>
      </div>

      {/* Frequency controls */}
      <div style={S.row}>
        <Grp label="Band">
          <select value={band} onChange={handleBand} style={S.select}>
            {Object.keys(BAND_GROUPS).map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </Grp>
        <Grp label="Start">
          <input type="number" value={viewStart} step="0.1" style={S.input}
            onChange={e => applyView(parseFloat(e.target.value) || viewStart, viewStop)}/>
          <span style={S.unit}>MHz</span>
        </Grp>
        <Grp label="Stop">
          <input type="number" value={viewStop} step="0.1" style={S.input}
            onChange={e => applyView(viewStart, parseFloat(e.target.value) || viewStop)}/>
          <span style={S.unit}>MHz</span>
        </Grp>
        <Grp label="Center">
          <input type="number" value={center} step="0.1" style={S.input}
            onChange={e => { const c = parseFloat(e.target.value)||0, s = viewStop - viewStart; applyView(c - s/2, c + s/2); }}/>
          <span style={S.unit}>MHz</span>
        </Grp>
        <Grp label="Span">
          <input type="number" value={spanVal} step="0.1" style={S.input}
            onChange={e => { const s = parseFloat(e.target.value)||1, c = (viewStart + viewStop)/2; applyView(c - s/2, c + s/2); }}/>
          <span style={S.unit}>MHz</span>
        </Grp>
        <Btn onClick={() => applyFullSpan(band)}>Full span</Btn>
      </div>

      {/* Level controls */}
      <div style={S.row}>
        <Grp label="Ref level">
          <input type="number" value={refLvl} step="5" style={S.input}
            onChange={e => { const v = parseFloat(e.target.value)||-10; C.current.refLvl = v; setRefLvl(v); }}/>
          <span style={S.unit}>dBm</span>
        </Grp>
        <Grp label="dB/div">
          <select value={dbDiv} onChange={e => { const v = +e.target.value; C.current.dbDiv = v; setDbDiv(v); }} style={S.select}>
            {[1,2,5,10].map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </Grp>
        <Grp label="Atten">
          <input type="number" value={atten} min="0" max="50" step="5" style={S.input}
            onChange={e => { const v = parseFloat(e.target.value)||0; C.current.atten = v; setAtten(v); }}/>
          <span style={S.unit}>dB</span>
        </Grp>
        <Grp label="RBW">
          <select value={rbwSel} onChange={e => { const v = +e.target.value; C.current.rbwSel = v; setRbwSel(v); }} style={S.select}>
            {[10,30,100,300,1000].map(v => <option key={v} value={v}>{v < 1000 ? v + ' kHz' : '1 MHz'}</option>)}
          </select>
        </Grp>
      </div>

      {/* Overlay toggles */}
      <div style={{...S.row, marginBottom:'6px'}}>
        <span style={{fontSize:'10px',color:'#777'}}>Overlays:</span>
        <label style={S.chkLbl}><input type="checkbox" checked={showSSB} style={{accentColor:'#33ff33'}}
          onChange={e => { C.current.showSSB = e.target.checked; setShowSSB(e.target.checked); }}/> SSB</label>
        <label style={S.chkLbl}><input type="checkbox" checked={showPointA} style={{accentColor:'#33ff33'}}
          onChange={e => { C.current.showPointA = e.target.checked; setShowPointA(e.target.checked); }}/> Point A</label>
        <label style={S.chkLbl}><input type="checkbox" checked={showCtr} style={{accentColor:'#33ff33'}}
          onChange={e => { C.current.showCtr = e.target.checked; setShowCtr(e.target.checked); }}/> Center</label>
      </div>

      {/* Trace mode + markers */}
      <div style={{display:'flex',gap:'4px',alignItems:'center',marginBottom:'6px',flexWrap:'wrap'}}>
        {[['cw','Clear/Write'],['max','Max hold'],['min','Min hold'],['avg','Average']].map(([m, l]) =>
          <Btn key={m} active={traceMode === m} onClick={() => setMode(m)}>{l}</Btn>
        )}
        <Btn onClick={resetTraces}>Reset traces</Btn>
        <span style={{marginLeft:'auto',display:'flex',gap:'4px'}}>
          <Btn onClick={peakSearch}>Peak search</Btn>
          <Btn onClick={nextPeak}>Next peak</Btn>
          <Btn onClick={() => { markersRef.current = []; setMarkers([]); }}>Clear markers</Btn>
        </span>
      </div>

      {/* Canvases */}
      <div style={{position:'relative',width:'100%'}}>
        <canvas ref={canRef} height="360" style={{display:'block',width:'100%',cursor:'crosshair'}} onClick={handleCanvasClick}/>
      </div>
      <div style={{position:'relative',width:'100%',marginTop:'2px'}}>
        <canvas ref={wfRef} height="100" style={{display:'block',width:'100%'}}/>
      </div>

      {/* Marker table */}
      <table style={{marginTop:'4px',width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>{['Marker','Freq (MHz)','Ampl (dBm)','Delta'].map(h => <th key={h} style={S.thCell}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {!markers.length
            ? <tr><td colSpan="4" style={{...S.tdCell, color:'#555'}}>Click on trace to place markers</td></tr>
            : markers.map((m, i) => {
                const delta = i === 0 ? '—' : `Δf=${(m.freq - markers[0].freq).toFixed(2)} MHz, ΔA=${(m.lvl - markers[0].lvl).toFixed(1)} dB`;
                return (
                  <tr key={i}>
                    <td style={{...S.tdCell, color:'#ffcc00'}}>{m.label}</td>
                    <td style={S.tdCell}>{m.freq.toFixed(3)}</td>
                    <td style={S.tdCell}>{m.lvl.toFixed(1)}</td>
                    <td style={S.tdCell}>{delta}</td>
                  </tr>
                );
              })
          }
        </tbody>
      </table>

      {/* Channel toggles */}
      <div style={{display:'flex',gap:'6px',padding:'3px 0 0',alignItems:'center'}}>
        <button style={{fontSize:'9px',color:'#33ff33',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',textDecoration:'underline',padding:0}}
          onClick={() => { bandChs.forEach(c => hiddenRef.current.delete(c.id)); setHiddenVer(v => v + 1); }}>Show all</button>
        <button style={{fontSize:'9px',color:'#33ff33',background:'none',border:'none',cursor:'pointer',fontFamily:'inherit',textDecoration:'underline',padding:0}}
          onClick={() => { bandChs.forEach(c => hiddenRef.current.add(c.id)); setHiddenVer(v => v + 1); }}>Hide all</button>
        <span style={{fontSize:'9px',color:'#555',marginLeft:'2px'}}>Click channel to toggle</span>
      </div>
      <div style={{display:'flex',flexWrap:'wrap',gap:'5px',padding:'6px 0',borderTop:'1px solid #1a1a1a',marginTop:'4px'}}>
        {bandChs.map((ch, ci) => {
          const col = COLORS[ci % COLORS.length];
          const off = hiddenRef.current.has(ch.id);
          return (
            <div key={ch.id} style={{display:'flex',alignItems:'center',gap:'4px',padding:'2px 7px',borderRadius:'4px',cursor:'pointer',border:`1px solid ${off ? '#333' : '#444'}`,background:'#151515',opacity: off ? 0.3 : 1}}
              onClick={() => { off ? hiddenRef.current.delete(ch.id) : hiddenRef.current.add(ch.id); setHiddenVer(v => v + 1); }}>
              <span style={{width:'8px',height:'8px',borderRadius:'2px',background:col,display:'inline-block'}}/>
              <span style={{fontSize:'9px',color: off ? '#666' : '#ccc',whiteSpace:'nowrap'}}>GSCN {ch.gscn} / {ch.bw}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SpectrumAnalyzer(props) {
  return (
    <BrowserOnly fallback={
      <div style={{background:'#0e0e0e',color:'#33ff33',padding:'20px',borderRadius:'10px',textAlign:'center',fontFamily:'monospace'}}>
        Loading spectrum analyzer...
      </div>
    }>
      {() => <SpectrumAnalyzerInner {...props} />}
    </BrowserOnly>
  );
}
