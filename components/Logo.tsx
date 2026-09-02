import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
}

const sizes = {
  sm: { icon: 28, text: 'text-base' },
  md: { icon: 36, text: 'text-xl' },
  lg: { icon: 48, text: 'text-2xl' },
};

export default function Logo({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'color',
}: LogoProps) {
  const { icon, text } = sizes[size];

  const wordmark = variant === 'light' ? 'text-white' : 'text-foreground';

  return (
    <div className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* Emblem: rounded-square gradient tile with interlocking rings */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.04]"
      >
        <defs>
          <linearGradient id="dl-emblem" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#dl-emblem)" />
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="11"
          stroke="white"
          strokeOpacity="0.14"
        />
        {/* Left ring */}
        <circle cx="16.5" cy="20" r="7" stroke="white" strokeWidth="2.6" />
        {/* Right ring */}
        <circle
          cx="24.5"
          cy="20"
          r="7"
          stroke="#A5F3FC"
          strokeWidth="2.6"
          className="transition-all duration-300 group-hover:stroke-[#CFFAFE]"
        />
      </svg>

      {!iconOnly && (
        <span className={`${text} font-semibold tracking-tight ${wordmark}`}>
          Deal
          <span className="text-accent transition-colors group-hover:text-accent-soft">
            Link
          </span>
        </span>
      )}
    </div>
  );
}
