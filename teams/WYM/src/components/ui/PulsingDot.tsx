import { memo } from 'react';

/* ──────────────────────────────────────────────────────────
   PulsingDot — Animated status indicator
   Colors: purple for active, green for completed, zinc for default
   ────────────────────────────────────────────────────────── */

interface PulsingDotProps {
  status: 'active' | 'upcoming' | 'completed' | 'missed';
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<string, { dot: string; ring: string }> = {
  active: { dot: 'bg-[#a882ff]', ring: 'bg-[#a882ff]/30' },
  upcoming: { dot: 'bg-[#60a5fa]', ring: 'bg-[#60a5fa]/30' },
  completed: { dot: 'bg-[#34d399]', ring: 'bg-[#34d399]/30' },
  missed: { dot: 'bg-red-500', ring: 'bg-red-500/30' },
};

const sizes = {
  sm: { dot: 'w-2 h-2', ring: 'w-4 h-4' },
  md: { dot: 'w-3 h-3', ring: 'w-6 h-6' },
  lg: { dot: 'w-4 h-4', ring: 'w-8 h-8' },
};

function PulsingDotComponent({ status, size = 'md' }: PulsingDotProps) {
  const colors = statusColors[status] ?? statusColors.upcoming;
  const dims = sizes[size];

  return (
    <div className="relative flex items-center justify-center">
      {(status === 'active' || status === 'upcoming') && (
        <span
          className={`absolute ${dims.ring} rounded-full ${colors.ring} animate-ping`}
        />
      )}
      <span className={`relative ${dims.dot} rounded-full ${colors.dot}`} />
    </div>
  );
}

export const PulsingDot = memo(PulsingDotComponent);
