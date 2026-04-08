import { memo } from 'react';
import { useCalendarStore } from '../../store/useCalendarStore';

/* ──────────────────────────────────────────────────────────
   BurnoutRisk — Animated progress bar with color coding
   Red > 60%, Amber > 35%, Green ≤ 35%
   ────────────────────────────────────────────────────────── */

function BurnoutRiskComponent() {
  const burnoutRisk = useCalendarStore((s) => s.burnoutRisk);
  const isRecalculating = useCalendarStore((s) => s.isRecalculating);

  const color =
    burnoutRisk > 60
      ? { bar: 'bg-red-500', glow: 'shadow-[0_0_12px_rgba(239,68,68,0.5)]', text: 'text-red-400' }
      : burnoutRisk > 35
        ? { bar: 'bg-amber-500', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]', text: 'text-amber-400' }
        : { bar: 'bg-[#34d399]', glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]', text: 'text-[#34d399]' };

  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider whitespace-nowrap">
        Burnout Risk
      </span>
      <div className="flex-1 h-2 bg-zinc-800/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color.bar} ${color.glow} ${
            isRecalculating ? 'animate-pulse' : ''
          }`}
          style={{ width: `${burnoutRisk}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${color.text} min-w-[2.5rem] text-right`}>
        {burnoutRisk}%
      </span>
    </div>
  );
}

export const BurnoutRisk = memo(BurnoutRiskComponent);
