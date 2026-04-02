interface PrismLogoProps {
  size?: number;
  className?: string;
}

export function PrismLogo({ size = 28, className = "" }: PrismLogoProps) {
  const padding = size * 0.15;
  const outerSize = size + padding * 2;
  const radius = size * 0.22;

  return (
    <svg
      width={outerSize}
      height={outerSize}
      viewBox={`0 0 ${outerSize} ${outerSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="prism-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9B51E0" />
          <stop offset="100%" stopColor="#7B68EE" />
        </linearGradient>
        <linearGradient id="prism-light" x1="20" y1="0" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-cyan" x1="26" y1="14" x2="38" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-violet" x1="26" y1="18" x2="38" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9B51E0" />
          <stop offset="100%" stopColor="#9B51E0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="beam-red" x1="26" y1="22" x2="38" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E94560" />
          <stop offset="100%" stopColor="#E94560" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* HBO Max-style black background with rounded corners */}
      <rect width={outerSize} height={outerSize} rx={radius} fill="#080010" />

      {/* Offset all inner elements by padding */}
      <g transform={`translate(${padding}, ${padding})`}>
        {/* Subtle purple glow behind prism */}
        <circle cx="20" cy="20" r="14" fill="#9B51E0" opacity="0.08" />

        {/* Prism body */}
        <path d="M20 4 L34 32 L6 32 Z" fill="url(#prism-grad)" />

        {/* Glass highlight */}
        <path d="M20 4 L27 18 L13 18 Z" fill="url(#prism-light)" />

        {/* Incoming light beam */}
        <line x1="1" y1="18" x2="14" y2="18" stroke="white" strokeWidth="1.5" strokeOpacity="0.7" />

        {/* Refracted beams */}
        <line x1="26" y1="16" x2="39" y2="11" stroke="url(#beam-cyan)" strokeWidth="1.8" />
        <line x1="26" y1="20" x2="39" y2="22" stroke="url(#beam-violet)" strokeWidth="1.8" />
        <line x1="26" y1="24" x2="39" y2="33" stroke="url(#beam-red)" strokeWidth="1.8" />
      </g>
    </svg>
  );
}
