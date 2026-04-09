import React from 'react';
import Link from '@docusaurus/Link';

function ProtocolRow({ icon, name, description }) {
  return (
    <div className="cc-layer">
      <span className="cc-layer__icon">{icon}</span>
      <span className="cc-layer__name">{name}</span>
      <span className="cc-layer__desc">{description}</span>
    </div>
  );
}

function Panel({ icon, title, subtitle, layers, accent }) {
  return (
    <div className={`cc-panel cc-panel--${accent}`}>
      <div className="cc-panel__header">
        <span className="cc-panel__header-icon">{icon}</span>
        <div>
          <div className="cc-panel__title">{title}</div>
          <div className="cc-panel__subtitle">{subtitle}</div>
        </div>
      </div>
      <div className="cc-panel__layers">
        {layers.map((l) => (
          <ProtocolRow key={l.name} {...l} />
        ))}
      </div>
    </div>
  );
}

export default function ComponentCard({
  to,
  icon,
  title,
  subtitle,
  description,
  leftPanel,
  rightPanel,
  interfaces = [],
}) {
  return (
    <Link to={to} className="component-card">
      <div className="cc-header">
        <div className="cc-header__accent" />
        <div className="cc-header__body">
          <div className="cc-header__top">
            <span className="cc-header__icon">{icon}</span>
            <div>
              <div className="cc-header__title">{title}</div>
              <div className="cc-header__subtitle">{subtitle}</div>
            </div>
          </div>
          {description && <p className="cc-header__desc">{description}</p>}
        </div>
      </div>

      <div className="cc-panels">
        {leftPanel && <Panel {...leftPanel} accent="green" />}
        {rightPanel && <Panel {...rightPanel} accent="yellow" />}
      </div>

      {interfaces.length > 0 && (
        <div className="cc-interfaces">
          <span className="cc-interfaces__label">INTERFACES</span>
          {interfaces.map((iface) => (
            <span key={iface.name} className={`cc-interface-badge cc-interface-badge--${iface.accent || 'green'}`}>
              <span className="cc-interface-badge__icon">{iface.icon}</span>
              <strong>{iface.name}</strong>
              <span>{iface.label}</span>
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
