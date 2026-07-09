// Server component — static SVG overlay + CSS gradient. Fixed behind everything.
export default function GrainyBackground() {
  return (
    <div className="grainy-overlay" aria-hidden="true">
      {/* Base diagonal gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 25% 20%, #f1c48d 0%, #ade7f6 35%, #ed9d8b 75%, #ea563c 100%)',
        }}
      />
      {/* Secondary warm wash */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'conic-gradient(from 210deg at 70% 80%, rgba(240,201,192,0.0) 0deg, rgba(240,201,192,0.45) 140deg, rgba(245,230,211,0.0) 300deg)',
          mixBlendMode: 'soft-light',
        }}
      />
      {/* Grain via SVG turbulence */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.22,
          mixBlendMode: 'multiply',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="dandy-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.15
                    0 0 0 0 0.10
                    0 0 0 0 0.08
                    0 0 0 0.9 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#dandy-grain)" />
      </svg>
    </div>
  );
}
