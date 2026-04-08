import { memo, useState } from 'react';
import { TimelineEntry } from './TimelineEntry';
import { useCalendarStore } from '../../store/useCalendarStore';

/* ──────────────────────────────────────────────────────────
   TemporalLog — Vertical timeline of today's study sessions
   Includes header tabs and scrollable entry list
   ────────────────────────────────────────────────────────── */

function TemporalLogComponent() {
  const sessions = useCalendarStore((s) => s.sessions);
  const missSession = useCalendarStore((s) => s.missSession);
  const isRecalculating = useCalendarStore((s) => s.isRecalculating);
  
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');

  // If week mode, roughly duplicate the visual length as a mock
  const visibleSessions = viewMode === 'today' ? sessions : [...sessions, ...sessions].sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
          Temporal Log
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode('today')}
            className={`text-sm font-medium transition-colors cursor-pointer ${viewMode === 'today' ? 'text-[#a882ff]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Today
          </button>
          <button 
            onClick={() => setViewMode('week')}
            className={`text-sm font-medium transition-colors cursor-pointer ${viewMode === 'week' ? 'text-[#a882ff]' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Recalculating overlay */}
      {isRecalculating && (
        <div className="mb-4 px-4 py-3 bg-[#a882ff]/5 border border-[#a882ff]/20 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#a882ff]/30 border-t-[#a882ff] rounded-full animate-spin" />
            <span className="text-[10px] font-mono text-[#a882ff] uppercase tracking-wider">
              Aegis Engine Recalculating Schedule...
            </span>
          </div>
        </div>
      )}

      {/* Timeline entries */}
      <div className="flex-1 overflow-y-auto pr-2 aegis-scrollbar">
        {visibleSessions.map((session, index) => (
          <TimelineEntry
            key={`${session.id}-${index}`} // Use index in key to safely support the mock array duplication
            session={session}
            isLast={index === visibleSessions.length - 1}
            onMiss={missSession}
          />
        ))}
      </div>
    </div>
  );
}

export const TemporalLog = memo(TemporalLogComponent);
