import React from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

const tools = [
  {
    layer: 'Layer 1',
    name: 'SignalScope',
    scope: 'RF / Air Interface',
    description: 'Physical-layer view of spectrum shape, I/Q constellation, EVM, BLER, and active RF impairments.',
    src: '/tools/5g_rf_analyzer_complete.html',
    accent: 'signal',
    height: 650,
  },
  {
    layer: 'Layer 2',
    name: 'FrameScope',
    scope: 'Resource Grid and Protocol',
    description: 'MAC, RLC, and PDCP behavior through HARQ activity, resource-grid allocation, retransmissions, and scheduling efficiency.',
    src: '/tools/5g_protocol_analyzer_interactive.html',
    accent: 'frame',
    height: 740,
  },
  {
    layer: 'Layer 3',
    name: 'NetScope',
    scope: 'Traffic and Data',
    description: 'Network and application-layer quality through throughput, latency, jitter, loss, TCP behavior, capacity, and QoE.',
    src: '/tools/5g_network_app_layer_analyzer.html',
    accent: 'net',
    height: 820,
  },
];

function NRToolPanel({ tool }) {
  const src = useBaseUrl(tool.src);

  return (
    <section className={`nr-tool nr-tool--${tool.accent}`} id={tool.name.toLowerCase()}>
      <div className="nr-tool__header">
        <div>
          <p className="nr-tool__layer">{tool.layer}</p>
          <h2 className="nr-tool__title">{tool.name}</h2>
          <p className="nr-tool__scope">{tool.scope}</p>
        </div>
        <a className="nr-tool__launch" href={src} target="_blank" rel="noreferrer">
          Open full screen
        </a>
      </div>
      <p className="nr-tool__description">{tool.description}</p>
      <iframe
        className="nr-tool__frame"
        title={`${tool.name} ${tool.scope}`}
        src={src}
        loading="lazy"
        style={{ minHeight: tool.height }}
      />
    </section>
  );
}

export default function NRToolsEmbed() {
  return (
    <div className="nr-tools">
      <div className="nr-tools__nav" aria-label="5G NR tools">
        {tools.map((tool) => (
          <a className={`nr-tools__nav-item nr-tools__nav-item--${tool.accent}`} href={`#${tool.name.toLowerCase()}`} key={tool.name}>
            <span>{tool.layer}</span>
            <strong>{tool.name}</strong>
          </a>
        ))}
      </div>
      {tools.map((tool) => (
        <NRToolPanel tool={tool} key={tool.name} />
      ))}
    </div>
  );
}
