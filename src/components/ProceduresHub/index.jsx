import React from 'react';
import ComponentCard from '../ComponentCard';

export default function ProceduresHub({ cards }) {
  return (
    <div className="procedures-hub">
      {cards.map((card) => (
        <ComponentCard key={card.to} {...card} />
      ))}
    </div>
  );
}
