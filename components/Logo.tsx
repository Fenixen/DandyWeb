// Inline SVG wordmark logo for Dandy's Wear. Uses currentColor, works at 16-200px.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 210 40"
      className={className}
      aria-label="Dandy's Wear"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="28"
        fontFamily="Instrument Serif, Georgia, serif"
        fontSize="26"
        fontStyle="italic"
        fill="currentColor"
      >
        Dandy&apos;s
      </text>
      <circle cx="104" cy="22" r="2" fill="currentColor" />
      <text
        x="116"
        y="26"
        fontFamily="Inter, sans-serif"
        fontSize="10"
        letterSpacing="0.22em"
        fill="currentColor"
        fontWeight="500"
      >
        WEAR
      </text>
    </svg>
  );
}

export function LogoMark({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="20"
        y="30"
        textAnchor="middle"
        fontFamily="Instrument Serif, Georgia, serif"
        fontSize="34"
        fontStyle="italic"
        fill="currentColor"
      >
        D
      </text>
    </svg>
  );
}
