import type { ReactNode } from "react";

export function HeadphonesLogo({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="#1D4ED8"
      strokeWidth="2.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 22v-5a11 11 0 0 1 22 0v5" />
      <rect x="3.5" y="19" width="6" height="9" rx="2.5" fill="#1D4ED8" stroke="none" />
      <rect x="22.5" y="19" width="6" height="9" rx="2.5" fill="#1D4ED8" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon({ strokeWidth = 2.2 }: { strokeWidth?: number }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function FeatureSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const GridIcon = () => (
  <FeatureSvg>
    <path d="M3 6h18M3 12h18M3 18h18M8 3v18M16 3v18" />
  </FeatureSvg>
);

export const ShapesIcon = () => (
  <FeatureSvg>
    <rect x="3" y="4" width="7" height="7" rx="1.5" />
    <rect x="14" y="4" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </FeatureSvg>
);

export const CircleIcon = () => (
  <FeatureSvg>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v4M21 12h-4M12 21v-4M3 12h4" />
  </FeatureSvg>
);

export const ChartIcon = () => (
  <FeatureSvg>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </FeatureSvg>
);
