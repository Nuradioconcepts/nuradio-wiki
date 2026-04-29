import React from 'react';

const nodes = [
  {
    id: 'ue',
    title: 'UE',
    subtitle: 'NAS, RRC, SDAP, PDCP, RLC, MAC, PHY',
    x: 86,
    y: 344,
    w: 108,
    d: 70,
    h: 62,
    domain: 'ue',
    tone: 'edge',
  },
  {
    id: 'ru',
    title: 'gNB-RU',
    subtitle: 'RF, lower PHY',
    x: 286,
    y: 334,
    w: 112,
    d: 70,
    h: 58,
    domain: 'ran',
    tone: 'ran',
  },
  {
    id: 'du',
    title: 'gNB-DU',
    subtitle: 'RLC, MAC, high PHY',
    x: 488,
    y: 276,
    w: 120,
    d: 76,
    h: 64,
    domain: 'ran',
    tone: 'ran',
  },
  {
    id: 'cuCp',
    title: 'gNB-CU-CP',
    subtitle: 'RRC, PDCP-C, F1AP, NGAP',
    x: 700,
    y: 208,
    w: 142,
    d: 82,
    h: 70,
    domain: 'ran',
    tone: 'control',
  },
  {
    id: 'cuUp',
    title: 'gNB-CU-UP',
    subtitle: 'SDAP, PDCP-U, GTP-U',
    x: 686,
    y: 390,
    w: 142,
    d: 82,
    h: 70,
    domain: 'ran',
    tone: 'user',
  },
  {
    id: 'amf',
    title: 'AMF',
    subtitle: 'N1/N2 anchor',
    x: 956,
    y: 160,
    w: 100,
    d: 64,
    h: 56,
    domain: 'core',
    tone: 'control',
  },
  {
    id: 'smf',
    title: 'SMF',
    subtitle: 'Session control',
    x: 1108,
    y: 248,
    w: 100,
    d: 64,
    h: 56,
    domain: 'core',
    tone: 'control',
  },
  {
    id: 'upf',
    title: 'UPF',
    subtitle: 'GTP-U, QoS, routing',
    x: 1018,
    y: 418,
    w: 112,
    d: 70,
    h: 62,
    domain: 'core',
    tone: 'user',
  },
  {
    id: 'dn',
    title: 'DN',
    subtitle: 'Data network',
    x: 1230,
    y: 420,
    w: 102,
    d: 66,
    h: 58,
    domain: 'external',
    tone: 'edge',
  },
  {
    id: 'nrf',
    title: 'NRF',
    subtitle: 'NF discovery',
    x: 1060,
    y: 50,
    w: 92,
    d: 58,
    h: 50,
    domain: 'core',
    tone: 'service',
  },
  {
    id: 'udm',
    title: 'UDM',
    subtitle: 'Subscriber data',
    x: 1210,
    y: 50,
    w: 92,
    d: 58,
    h: 50,
    domain: 'core',
    tone: 'service',
  },
  {
    id: 'ausf',
    title: 'AUSF',
    subtitle: 'Authentication',
    x: 910,
    y: 50,
    w: 92,
    d: 58,
    h: 50,
    domain: 'core',
    tone: 'service',
  },
  {
    id: 'pcf',
    title: 'PCF',
    subtitle: 'Policy',
    x: 1192,
    y: 154,
    w: 92,
    d: 58,
    h: 50,
    domain: 'core',
    tone: 'service',
  },
  {
    id: 'nssf',
    title: 'NSSF',
    subtitle: 'Slice select',
    x: 1340,
    y: 154,
    w: 92,
    d: 58,
    h: 50,
    domain: 'core',
    tone: 'service',
  },
];

const links = [
  {
    id: 'uu',
    path: 'M194 398 C226 410 254 424 286 422',
    label: 'Uu',
    detail: 'NR PHY/MAC/RLC/PDCP/RRC',
    x: 248,
    y: 444,
    tone: 'radio',
  },
  {
    id: 'fh',
    path: 'M398 390 C428 410 458 430 488 412',
    label: 'Open FH',
    detail: 'eCPRI / CPRI, IQ',
    x: 448,
    y: 444,
    tone: 'ran',
  },
  {
    id: 'f1c',
    path: 'M608 336 C638 314 668 292 700 279',
    label: 'F1-C',
    detail: 'F1AP over SCTP',
    x: 646,
    y: 292,
    tone: 'control',
  },
  {
    id: 'f1u',
    path: 'M608 376 C632 424 658 488 686 496',
    label: 'F1-U',
    detail: 'GTP-U over UDP/IP',
    x: 626,
    y: 496,
    tone: 'user',
  },
  {
    id: 'e1',
    path: 'M842 310 C882 360 850 424 828 458',
    label: 'E1',
    detail: 'E1AP over SCTP',
    x: 866,
    y: 412,
    tone: 'control',
  },
  {
    id: 'ngc',
    path: 'M842 280 C884 250 914 222 956 210',
    label: 'NG-C / N2',
    detail: 'NGAP over SCTP',
    x: 898,
    y: 248,
    tone: 'control',
  },
  {
    id: 'ngu',
    path: 'M828 462 C888 506 956 548 1018 504',
    label: 'NG-U / N3',
    detail: 'GTP-U over UDP/IP',
    x: 918,
    y: 560,
    tone: 'user',
  },
  {
    id: 'n4',
    path: 'M1156 304 C1162 366 1132 424 1074 454',
    label: 'N4',
    detail: 'PFCP',
    x: 1180,
    y: 390,
    tone: 'control',
  },
  {
    id: 'n6',
    path: 'M1130 474 C1164 486 1196 492 1230 470',
    label: 'N6',
    detail: 'IP user traffic',
    x: 1188,
    y: 510,
    tone: 'user',
  },
  {
    id: 'n11',
    path: 'M1056 210 C1088 224 1114 248 1130 286',
    label: 'N11',
    detail: 'AMF <-> SMF SBI',
    x: 1084,
    y: 236,
    tone: 'service',
  },
  {
    id: 'n1',
    path: 'M140 356 C326 190 720 128 956 190',
    label: 'N1',
    detail: 'NAS via RRC/NGAP',
    x: 528,
    y: 166,
    tone: 'control',
    dash: true,
  },
];

const ISO_SLOPE = 0.5;

function isoPoint(x, y, dx = 0, dy = 0) {
  return {
    x: x + dx - dy,
    y: y + (dx + dy) * ISO_SLOPE,
  };
}

function pointsToString(points) {
  return points.map((point) => `${point.x},${point.y}`).join(' ');
}

function IsoPlane({ x, y, w, d, className, grid = 8 }) {
  const p0 = isoPoint(x, y);
  const p1 = isoPoint(x, y, w, 0);
  const p2 = isoPoint(x, y, w, d);
  const p3 = isoPoint(x, y, 0, d);
  const depthLines = Array.from({ length: grid + 1 }, (_, i) => i / grid);
  const widthLines = Array.from({ length: grid + 1 }, (_, i) => i / grid);

  return (
    <g className={`nr-arch-plane ${className}`}>
      <polygon className="nr-arch-plane__surface" points={pointsToString([p0, p1, p2, p3])} />
      <g className="nr-arch-plane__grid">
        {depthLines.map((t) => {
          const a = isoPoint(x, y, 0, d * t);
          const b = isoPoint(x, y, w, d * t);
          return <line key={`d-${t}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
        {widthLines.map((t) => {
          const a = isoPoint(x, y, w * t, 0);
          const b = isoPoint(x, y, w * t, d);
          return <line key={`w-${t}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
        })}
      </g>
    </g>
  );
}

function IsoNode({ node }) {
  const { x, y, w, d, h, tone, domain, title, subtitle } = node;
  const p0 = isoPoint(x, y);
  const p1 = isoPoint(x, y, w, 0);
  const p2 = isoPoint(x, y, w, d);
  const p3 = isoPoint(x, y, 0, d);
  const b0 = { x: p0.x, y: p0.y + h };
  const b1 = { x: p1.x, y: p1.y + h };
  const b2 = { x: p2.x, y: p2.y + h };
  const b3 = { x: p3.x, y: p3.y + h };
  const labelX = (p0.x + p1.x + p2.x + p3.x) / 4;
  const labelY = (p0.y + p1.y + p2.y + p3.y) / 4;

  return (
    <g className={`nr-arch-node nr-arch-node--${tone} nr-arch-node--${domain}`}>
      <polygon className="nr-arch-node__shadow" points={pointsToString([b0, b1, b2, b3])} />
      <polygon className="nr-arch-node__right" points={pointsToString([p1, p2, b2, b1])} />
      <polygon className="nr-arch-node__front" points={pointsToString([p0, p1, b1, b0])} />
      <polygon className="nr-arch-node__left" points={pointsToString([p0, p3, b3, b0])} />
      <polygon className="nr-arch-node__top" points={pointsToString([p0, p1, p2, p3])} />
      <polyline className="nr-arch-node__top-ridge" points={pointsToString([p0, p1, p2])} />
      <g className="nr-arch-node__label" transform={`rotate(26.565 ${labelX} ${labelY})`}>
        <text className="nr-arch-node__title" x={labelX} y={labelY - 5} textAnchor="middle">
          {title}
        </text>
        <text className="nr-arch-node__subtitle" x={labelX} y={labelY + 12} textAnchor="middle">
          {subtitle}
        </text>
      </g>
    </g>
  );
}

function LinkLabel({ link }) {
  return (
    <g className={`nr-arch-link-label nr-arch-link-label--${link.tone}`}>
      <rect x={link.x - 48} y={link.y - 16} width="96" height="32" rx="8" />
      <text className="nr-arch-link-label__name" x={link.x} y={link.y - 3} textAnchor="middle">
        {link.label}
      </text>
      <text className="nr-arch-link-label__detail" x={link.x} y={link.y + 11} textAnchor="middle">
        {link.detail}
      </text>
    </g>
  );
}

export default function NRArchitectureDiagram() {
  return (
    <figure className="nr-arch">
      <div className="nr-arch__scroller" role="img" aria-labelledby="nr-arch-title nr-arch-desc">
        <svg viewBox="0 0 1480 690" className="nr-arch__svg" xmlns="http://www.w3.org/2000/svg">
          <title id="nr-arch-title">5G NR network architecture</title>
          <desc id="nr-arch-desc">
            Isometric diagram showing UE, NG-RAN split components, 5G Core network functions, interfaces, and major protocols.
          </desc>
          <defs>
            <linearGradient id="nrArchDeck" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#15231c" />
              <stop offset="100%" stopColor="#080d0b" />
            </linearGradient>
            <marker id="nrArchArrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M2 2L10 6L2 10" fill="none" stroke="#b1f727" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>

          <rect className="nr-arch__backdrop" x="16" y="18" width="1448" height="650" rx="24" />
          <IsoPlane className="nr-arch-plane--ran" x="260" y="404" w="560" d="290" grid={8} />
          <IsoPlane className="nr-arch-plane--core" x="970" y="118" w="450" d="250" grid={7} />
          <IsoPlane className="nr-arch-plane--up" x="1030" y="430" w="330" d="170" grid={5} />

          <text className="nr-arch__zone" x="478" y="586" textAnchor="middle">NG-RAN</text>
          <text className="nr-arch__zone" x="1170" y="356" textAnchor="middle">5G Core control plane</text>
          <text className="nr-arch__zone" x="1146" y="632" textAnchor="middle">User plane</text>

          {nodes.map((node) => (
            <IsoNode key={node.id} node={node} />
          ))}

          <g className="nr-arch-links">
            {links.map((link) => (
              <path
                key={link.id}
                className={`nr-arch-link nr-arch-link--${link.tone}${link.dash ? ' nr-arch-link--dash' : ''}`}
                d={link.path}
                markerEnd="url(#nrArchArrow)"
              />
            ))}
          </g>

          {links.map((link) => (
            <LinkLabel key={`${link.id}-label`} link={link} />
          ))}

          <g className="nr-arch-sbi">
            <path d="M974 148 C1012 178 1048 196 1084 220" />
            <path d="M1114 148 C1128 194 1138 242 1143 318" />
            <path d="M1254 148 C1240 198 1218 244 1180 318" />
            <path d="M1296 220 L1330 220" />
            <text x="1188" y="188" textAnchor="middle">SBI / HTTP/2</text>
            <text x="1188" y="204" textAnchor="middle">Namf · Nsmf · Nudm · Nausf · Npcf · Nnrf · Nnssf</text>
          </g>

          <g className="nr-arch__legend">
            <rect x="54" y="54" width="388" height="150" rx="16" />
            <text className="nr-arch__legend-title" x="76" y="84">Domain and interface key</text>
            <rect className="nr-arch__legend-swatch nr-arch__legend-swatch--ue" x="78" y="101" width="16" height="16" rx="4" />
            <text x="106" y="114">UE / access device</text>
            <rect className="nr-arch__legend-swatch nr-arch__legend-swatch--ran" x="228" y="101" width="16" height="16" rx="4" />
            <text x="256" y="114">NG-RAN</text>
            <rect className="nr-arch__legend-swatch nr-arch__legend-swatch--core" x="326" y="101" width="16" height="16" rx="4" />
            <text x="354" y="114">5GC</text>
            <line className="nr-arch-link nr-arch-link--control" x1="78" y1="140" x2="132" y2="140" />
            <text x="148" y="145">Control plane: RRC, NAS, NGAP, F1AP, E1AP, PFCP</text>
            <line className="nr-arch-link nr-arch-link--user" x1="78" y1="166" x2="132" y2="166" />
            <text x="148" y="171">User plane: SDAP, PDCP-U, GTP-U, IP payloads</text>
            <line className="nr-arch-link nr-arch-link--radio" x1="78" y1="192" x2="132" y2="192" />
            <text x="148" y="197">Radio/fronthaul: Uu, IQ transport, PHY timing</text>
          </g>
        </svg>
      </div>
      <figcaption>
        A split gNB deployment is shown for clarity. Monolithic gNB deployments collapse the RU/DU/CU blocks, while O-RAN deployments can expose additional open interfaces around the RU, DU, and RIC layers.
      </figcaption>
    </figure>
  );
}
