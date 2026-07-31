import React from 'react';

/** Renders card artwork preview, including demo placeholder when no image URL. */
export function ArtworkPreview({ artwork, alt = 'card artwork', imgStyle = {} }) {
  if (!artwork) return null;

  if (artwork.previewUrl && artwork.fileType !== 'image/svg+xml') {
    return (
      <img
        src={artwork.previewUrl}
        alt={alt}
        style={{ maxWidth: '90%', maxHeight: '55%', objectFit: 'contain', borderRadius: 4, ...imgStyle }}
      />
    );
  }

  if (artwork.isDemo) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 4, padding: '8px 12px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, opacity: 0.35, lineHeight: 1 }}>🖼</div>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fta-text-3)' }}>Demo artwork placeholder</div>
        <div style={{ fontSize: 10.5, color: 'var(--fta-text-4)' }}>{artwork.fileName || 'demo-card.png'}</div>
      </div>
    );
  }

  return null;
}

/** Detail-page artwork block (front/back). */
export function ArtworkDetailBlock({ artwork, label }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--fta-text-3)', marginBottom: 6 }}>{label}</div>
      {artwork?.previewUrl && artwork.fileType !== 'image/svg+xml' ? (
        <img src={artwork.previewUrl} alt={label} style={{ maxHeight: 80, maxWidth: '100%', borderRadius: 6, border: '1px solid var(--fta-line-2)' }} />
      ) : artwork?.isDemo ? (
        <div style={{ fontSize: 13, color: 'var(--fta-text-3)', fontStyle: 'italic', padding: '10px 12px', background: 'var(--fta-fill-2)', borderRadius: 6, border: '1px dashed var(--fta-line-2)' }}>
          Demo artwork placeholder ({artwork.fileName || 'demo'})
        </div>
      ) : (
        <div style={{ fontSize: 13, color: 'var(--fta-text-3)', fontStyle: 'italic' }}>
          {artwork ? artwork.fileName : 'Not configured'}
        </div>
      )}
      {artwork?.width && (
        <div style={{ fontSize: 11.5, color: 'var(--fta-text-4)', marginTop: 4 }}>{artwork.width} × {artwork.height} px</div>
      )}
    </div>
  );
}
