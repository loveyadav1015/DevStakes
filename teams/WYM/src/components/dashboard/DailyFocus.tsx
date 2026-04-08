import { memo } from 'react';
import { Atom } from 'lucide-react';
import { useCalendarStore } from '../../store/useCalendarStore';

/* ──────────────────────────────────────────────────────────
   DailyFocus — Highlights the current high-priority session
   Shown as a card with subject icon & priority badge
   ────────────────────────────────────────────────────────── */

import { StatCard } from './StatCard';
import { CheckCircle2 } from 'lucide-react';

function DailyFocusComponent() {
  const sessions = useCalendarStore((s) => s.sessions);
  
  // Find active session, or fallback to first high priority upcoming, or first upcoming
  const activeSession = sessions.find(s => s.status === 'active');
  const upcomingHighPriority = sessions.find(s => s.status === 'upcoming' && s.priority === 'high');
  const upcomingSession = sessions.find(s => s.status === 'upcoming');
  
  const focus = activeSession || upcomingHighPriority || upcomingSession;

  if (!focus) {
    return (
      <StatCard>
        <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Daily Focus
        </h2>
        <div className="flex items-center justify-center flex-col gap-3 py-4">
          <CheckCircle2 size={32} className="text-[#34d399]" />
          <h3 className="text-white font-semibold text-base">All Tasks Accomplished!</h3>
          <p className="text-zinc-500 text-xs">No pending operations in the timeline.</p>
        </div>
      </StatCard>
    );
  }

  return (
    <StatCard>
      <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
        Daily Focus
      </h2>

      <div className="flex items-start gap-4">
        {/* Subject Icon */}
        <div className="w-12 h-12 rounded-xl bg-[#a882ff]/10 border border-[#a882ff]/20 flex items-center justify-center flex-shrink-0">
          <Atom size={22} className="text-[#a882ff]" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg leading-tight truncate">
            {focus.subject}
          </h3>
          <p className="text-zinc-500 text-sm mt-0.5 truncate">{focus.title}</p>
        </div>
      </div>

      {/* Time + Priority */}
      <div className="flex items-center gap-3 mt-4">
        <span className="text-sm font-mono text-zinc-400">
          {focus.time} - {focus.timeEnd}
        </span>
        <span
          className={`
            px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider
            ${
              focus.priority === 'high'
                ? 'bg-[#a882ff]/15 text-[#a882ff] border border-[#a882ff]/20'
                : focus.priority === 'medium'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                  : 'bg-zinc-700/50 text-zinc-400 border border-zinc-700'
            }
          `}
        >
          {focus.priority} Priority
        </span>
      </div>
    </StatCard>
  );
}

export const DailyFocus = memo(DailyFocusComponent);
