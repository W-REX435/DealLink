import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
}

export default function Logo({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'color',
}: LogoProps) {
  // Dimensions
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  // Color variants for text
  const textColors = {
    color: 'text-white',
    dark: 'text-[#04342C]',
    light: 'text-white',
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Interlocking Rings Emblem */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 44 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Left Ring */}
        <circle
          cx="15"
          cy="14"
          r="10"
          stroke="#0F6E56"
          strokeWidth="4"
          className="transition-colors group-hover:stroke-[#1D9E75]"
        />
        {/* Right Ring */}
        <circle
          cx="29"
          cy="14"
          r="10"
          stroke="#1D9E75"
          strokeWidth="4"
          className="transition-colors group-hover:stroke-[#26C296]"
        />
        {/* Overlap Interlock effect */}
        <path
          d="M20 7.5 C 22 9.5, 23 11, 23 14 C 23 17, 22 18.5, 20 20.5"
          stroke="#0F6E56"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {!iconOnly && (
        <span className={`font-bold tracking-tight ${text} ${textColors[variant]}`}>
          Deal<span className="text-[#1D9E75]">Link</span>
        </span>
      )}
    </div>
  );
}
