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
      {/* Background circle — ocean gradient */}
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#023E8A" />
          <stop offset="50%" stopColor="#0077B6" />
          <stop offset="100%" stopColor="#00B4D8" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill="url(#logo-grad)" />

      {/* Subtle wave overlay */}
      <path d="M0 38 Q16 32 32 38 Q48 44 64 38 L64 64 L0 64Z" fill="white" opacity="0.1" />

      {/* Fish hook */}
      <g transform="translate(18, 10)">
        <path
          d="M14 4 L14 24 Q14 34 8 34 Q2 34 2 28"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M2 28 L5 31"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="14" cy="4" r="3" stroke="white" strokeWidth="2.5" fill="none" />
      </g>

      {/* Fish silhouette */}
      <g transform="translate(22, 34)">
        <path
          d="M0 8 Q4 4 10 4 Q16 4 20 8 Q16 12 10 12 Q4 12 0 8Z"
          fill="white"
          opacity="0.9"
        />
        <path
          d="M0 8 L-4 4 L-4 12 Z"
          fill="white"
          opacity="0.9"
        />
        <circle cx="15" cy="7.5" r="1.5" fill="#0077B6" />
      </g>
    </svg>
  );
}
