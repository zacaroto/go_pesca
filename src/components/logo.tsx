type Props = {
  size?: number;
  className?: string;
};

export function Logo({ size = 32, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with CR flag colors */}
      <circle cx="32" cy="32" r="32" fill="#002B7F" />
      <rect x="0" y="12" width="64" height="8" fill="#FFFFFF" rx="0" />
      <rect x="0" y="20" width="64" height="12" fill="#CE1126" rx="0" />
      <rect x="0" y="32" width="64" height="8" fill="#FFFFFF" rx="0" />
      {/* Clip the flag bands to the circle */}
      <circle cx="32" cy="32" r="32" fill="none" stroke="#002B7F" strokeWidth="0" />

      {/* Dark overlay for contrast */}
      <circle cx="32" cy="32" r="32" fill="rgba(0,43,127,0.35)" />

      {/* Fish hook - stylized */}
      <g transform="translate(18, 10)">
        {/* Hook line */}
        <path
          d="M14 4 L14 24 Q14 34 8 34 Q2 34 2 28"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hook barb */}
        <path
          d="M2 28 L5 31"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hook eye (top ring) */}
        <circle cx="14" cy="4" r="3" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      </g>

      {/* Fish silhouette */}
      <g transform="translate(22, 34)">
        <path
          d="M0 8 Q4 4 10 4 Q16 4 20 8 Q16 12 10 12 Q4 12 0 8Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        {/* Fish tail */}
        <path
          d="M0 8 L-4 4 L-4 12 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        {/* Fish eye */}
        <circle cx="15" cy="7.5" r="1.5" fill="#002B7F" />
      </g>
    </svg>
  );
}
