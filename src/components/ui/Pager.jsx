import React from 'react';

export function Pager() {
  return (
    <div className="pager">
      <button disabled>‹</button>
      <button className="--active">1</button>
      <button>2</button>
      <button>3</button>
      <button>4</button>
      <button>5</button>
      <button>›</button>
    </div>
  );
}
