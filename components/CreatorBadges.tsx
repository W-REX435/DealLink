import React from 'react';
import { Award, Zap, Sparkles, TrendingUp, Flame, ShieldCheck, Star } from 'lucide-react';

export interface BadgeConfig {
  id: string;
  label: string;
  arabicLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  borderColor?: string;
  bgColor?: string;
}

export const PRESET_BADGES: Record<string, BadgeConfig> = {
  'top-creator': {
    id: 'top-creator',
    label: 'Top Creator',
    arabicLabel: 'أفضل صانع محتوى',
    icon: Award,
    iconColor: 'text-pink-400',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  },
  'responds-fast': {
    id: 'responds-fast',
    label: 'Responds Fast',
    arabicLabel: 'رد سريع',
    icon: Zap,
    iconColor: 'text-emerald-400',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  },
  'featured': {
    id: 'featured',
    label: 'Featured',
    arabicLabel: 'مميز',
    icon: Sparkles,
    iconColor: 'text-amber-400',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  },
  'rising-star': {
    id: 'rising-star',
    label: 'Rising Star',
    arabicLabel: 'نجم صاعد',
    icon: TrendingUp,
    iconColor: 'text-purple-400',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  },
  'high-roi': {
    id: 'high-roi',
    label: 'High ROI',
    arabicLabel: 'أعلى عائد',
    icon: Flame,
    iconColor: 'text-orange-400',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  },
  'pro-quality': {
    id: 'pro-quality',
    label: 'Pro Quality',
    arabicLabel: 'جودة احترافية',
    icon: ShieldCheck,
    iconColor: 'text-blue-400',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  },
};

export function resolveBadge(badgeName: string): BadgeConfig {
  const normalized = badgeName.toLowerCase().trim().replace(/\s+/g, '-');
  if (PRESET_BADGES[normalized]) return PRESET_BADGES[normalized];

  // Match by label
  for (const key of Object.keys(PRESET_BADGES)) {
    if (PRESET_BADGES[key].label.toLowerCase() === badgeName.toLowerCase().trim()) {
      return PRESET_BADGES[key];
    }
  }

  // Fallback for custom badge
  return {
    id: normalized,
    label: badgeName,
    arabicLabel: badgeName,
    icon: Star,
    iconColor: 'text-accent',
    borderColor: 'border-white/20',
    bgColor: 'bg-black/85',
  };
}

interface CreatorBadgesProps {
  badges?: string[];
  size?: 'sm' | 'md';
  className?: string;
}

export default function CreatorBadges({
  badges,
  size = 'md',
  className = '',
}: CreatorBadgesProps) {
  if (!badges || !Array.isArray(badges) || badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {badges.map((b) => {
        const config = resolveBadge(b);
        const Icon = config.icon;
        return (
          <span
            key={b}
            className={`inline-flex items-center gap-1.5 rounded-lg border ${
              config.borderColor || 'border-white/20'
            } ${config.bgColor || 'bg-black/85'} backdrop-blur-md font-bold text-white shadow-sm transition-transform hover:scale-105 ${
              size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
            }`}
          >
            <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} ${config.iconColor} fill-current`} />
            <span className="tracking-tight">{config.label}</span>
          </span>
        );
      })}
    </div>
  );
}
