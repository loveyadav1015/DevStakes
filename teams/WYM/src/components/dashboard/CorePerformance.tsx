import { memo } from 'react';
import { TrendingUp } from 'lucide-react';
import { StatCard } from './StatCard';
import { useCalendarStore } from '../../store/useCalendarStore';

/* ──────────────────────────────────────────────────────────
   CorePerformance — Large efficiency stat + day streak
   Matches the "94.2% Efficiency" card from the reference UI
   ────────────────────────────────────────────────────────── */

function CorePerformanceComponent() {
  const efficiency = useCalendarStore((s) => s.efficiency);
  const dayStreak = useCalendarStore((s) => s.dayStreak);
  const peakOutput = useCalendarStore((s) => s.peakOutput);

  return (
    <StatCard glow>
      <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
        Core Performance
      </h2>

      {/* Large efficiency number */}
      <div className="flex items-end gap-3 mb-6">
        <span className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-zinc-400">
          {efficiency.toFixed(1)}%
        </span>
        <div className="flex items-center gap-1 mb-2">
          <TrendingUp size={14} className="text-[#a882ff]" />
          <span className="text-[#a882ff] text-sm font-medium">Efficiency</span>
        </div>
      </div>

      {/* Sub-stats */}
      <div className="flex items-center gap-8">
        <div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
            Day Streak
          </p>
          <p className="text-xl font-bold text-white mt-0.5">
            {dayStreak} Days
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
            Peak Output
          </p>
          <p className="text-xl font-bold text-white mt-0.5">{peakOutput}</p>
        </div>
      </div>
    </StatCard>
  );
}

export const CorePerformance = memo(CorePerformanceComponent);
