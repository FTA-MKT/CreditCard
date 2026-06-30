import React from 'react';
import { Icon } from './Icon';

export function Breadcrumb({ items, navigate }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((it, i) => {
        const isLast = i === items.length - 1;
        if (isLast) {
          return <span key={i} className="crumb-current" aria-current="page">{it.label}</span>;
        }
        return (
          <React.Fragment key={i}>
            <span
              className="crumb-link"
              role="button"
              tabIndex={0}
              onClick={() => it.route && navigate(it.route, it.param || null)}
              onKeyDown={e => e.key === 'Enter' && it.route && navigate(it.route, it.param || null)}
            >
              {i === 0 && <Icon name="chev-left" size={13} />}
              {it.label}
            </span>
            <span className="crumb-sep" aria-hidden="true">/</span>
          </React.Fragment>
        );
      })}
    </nav>
  );
}
