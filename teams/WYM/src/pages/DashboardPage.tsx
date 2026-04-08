import { CorePerformance } from '../components/dashboard/CorePerformance';
import { DailyFocus } from '../components/dashboard/DailyFocus';
import { TemporalLog } from '../components/timeline/TemporalLog';
import { NodeMap } from '../components/nodemap/NodeMap';
import { useCalendarStore } from '../store/useCalendarStore';

/* ──────────────────────────────────────────────────────────
   Dashboard Page — 3-Column Grid Layout
   Col 1: Metrics (Core Performance + Daily Focus)
   Col 2: Temporal Log (Timeline)
   Col 3: Syllabus Node Map
   ────────────────────────────────────────────────────────── */

export default function DashboardPage() {
  const sessions = useCalendarStore((s) => s.sessions);

  const completedCount = sessions.filter(s => s.status === 'completed').length;
  const missedCount = sessions.filter(s => s.status === 'missed').length;
  const pendingCount = sessions.filter(s => s.status === 'upcoming' || s.status === 'active').length;

  // Mock calculation out of standard metrics for visual dynamically based roughly on 7 days spanning tasks remaining
  const activeIntensity = Math.min(100, pendingCount * 12);
  const weekHeights = [completedCount * 10, 80, 45, Math.max(10, activeIntensity), 70, 85, 55].map(h => Math.min(100, h || 15));

  return (
    <div className="flex-1 w-full grid grid-cols-[1fr_1fr_1.3fr] gap-6 animate-fadeIn min-h-0">
      {/* Column 1 — Metrics */}
      <div className="flex flex-col gap-5 overflow-y-auto pr-1 aegis-scrollbar">
        <CorePerformance />
        <DailyFocus />

        {/* Session History */}
        <div className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-6 xl:p-7">
          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-3">
            Session History
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Completed', value: completedCount.toString(), color: 'text-[#34d399]' },
              { label: 'Missed', value: missedCount.toString(), color: 'text-red-400' },
              { label: 'Pending', value: pendingCount.toString(), color: 'text-[#60a5fa]' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress Mini-chart */}
        <div className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-6 xl:p-7">
          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
            Weekly Output
          </h3>
          <div className="flex items-end gap-2 h-24">
            {weekHeights.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-md transition-all duration-500 hover:opacity-100"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 3
                        ? 'linear-gradient(to top, #a882ff, #c4a6ff)'
                        : 'linear-gradient(to top, #27272a, #3f3f46)',
                    opacity: i === 3 ? 1 : 0.7,
                  }}
                />
                <span className="text-[8px] font-mono text-zinc-700">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2 — Temporal Log */}
      <div className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-6 xl:p-7 overflow-hidden h-full flex flex-col">
        <TemporalLog />
      </div>

      {/* Column 3 — Node Map */}
      <div className="overflow-hidden h-full flex flex-col">
        <NodeMap />
      </div>
    </div>
  );
}
