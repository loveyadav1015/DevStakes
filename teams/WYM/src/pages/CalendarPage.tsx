import { Link } from 'react-router-dom';
import { CalendarDays, ArrowLeft, Clock, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { BurnoutRisk } from '../components/dashboard/BurnoutRisk';
import { useCalendarStore } from '../store/useCalendarStore';
import { GlowButton } from '../components/ui/GlowButton';

/* ──────────────────────────────────────────────────────────
   Calendar Page — Self-healing study calendar
   ────────────────────────────────────────────────────────── */

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`);

export default function CalendarPage() {
  const sessions = useCalendarStore((s) => s.sessions);
  const burnoutRisk = useCalendarStore((s) => s.burnoutRisk);
  const isRecalculating = useCalendarStore((s) => s.isRecalculating);
  const recalculate = useCalendarStore((s) => s.recalculate);
  const missSession = useCalendarStore((s) => s.missSession);

  const missedCount = sessions.filter((s) => s.status === 'missed').length;
  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <CalendarDays size={20} className="text-[#a882ff]" />
              Adaptive Calendar
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              Self-healing schedule powered by Aegis Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <BurnoutRisk />
          </div>
          <GlowButton
            onClick={recalculate}
            disabled={isRecalculating}
            icon={<Zap size={14} />}
            variant={isRecalculating ? 'secondary' : 'primary'}
          >
            {isRecalculating ? 'Recalculating...' : 'Recalculate'}
          </GlowButton>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#a882ff]/10 flex items-center justify-center">
              <Clock size={18} className="text-[#a882ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{sessions.length}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Total Sessions</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#34d399]/10 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-[#34d399]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#34d399]">{completedCount}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{missedCount}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Missed</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              burnoutRisk > 60 ? 'bg-red-500/10' : burnoutRisk > 35 ? 'bg-amber-500/10' : 'bg-[#34d399]/10'
            }`}>
              <Zap size={18} className={
                burnoutRisk > 60 ? 'text-red-400' : burnoutRisk > 35 ? 'text-amber-400' : 'text-[#34d399]'
              } />
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                burnoutRisk > 60 ? 'text-red-400' : burnoutRisk > 35 ? 'text-amber-400' : 'text-[#34d399]'
              }`}>{burnoutRisk}%</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Burnout Risk</p>
            </div>
          </div>
        </StatCard>
      </div>

      {/* Recalculating Banner */}
      {isRecalculating && (
        <div className="mb-4 px-6 py-4 bg-[#a882ff]/5 border border-[#a882ff]/20 rounded-2xl flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#a882ff]/30 border-t-[#a882ff] rounded-full animate-spin" />
          <div>
            <p className="text-sm font-medium text-[#a882ff]">Aegis Engine Active</p>
            <p className="text-[10px] font-mono text-zinc-500">Recalculating optimal schedule based on completed and missed sessions...</p>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <StatCard className="overflow-hidden">
        <div className="grid grid-cols-8 gap-px bg-zinc-800/30">
          {/* Header row */}
          <div className="bg-[#121214] p-3" />
          {weekDays.map((day) => (
            <div
              key={day}
              className="bg-[#121214] p-3 text-center text-[10px] font-mono text-zinc-500 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}

          {/* Time rows */}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              <div
                className="bg-[#0e0e11] p-3 text-[10px] font-mono text-zinc-600 text-right pr-4"
              >
                {hour}
              </div>
              {weekDays.map((day) => {
                const hourNum = parseInt(hour);
                const sessionInSlot = sessions.find(
                  (s) => parseInt(s.time) === hourNum
                );
                const showSession = sessionInSlot && day === 'Wed';

                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`bg-[#0e0e11] p-2 min-h-[48px] border-t border-zinc-800/20 transition-colors
                      ${showSession ? '' : 'hover:bg-zinc-800/20'}`}
                  >
                    {showSession && (
                      <div
                        className={`rounded-lg px-2 py-1.5 text-[10px] cursor-pointer transition-all duration-200 ${
                          sessionInSlot.status === 'missed'
                            ? 'bg-red-500/10 border border-red-500/20 text-red-400 line-through'
                            : sessionInSlot.status === 'completed'
                              ? 'bg-[#34d399]/10 border border-[#34d399]/20 text-[#34d399]'
                              : 'bg-[#a882ff]/10 border border-[#a882ff]/20 text-[#a882ff] hover:bg-[#a882ff]/15'
                        }`}
                        onClick={() => {
                          if (sessionInSlot.status !== 'missed' && sessionInSlot.status !== 'completed') {
                            missSession(sessionInSlot.id);
                          }
                        }}
                      >
                        <p className="font-medium truncate">{sessionInSlot.title}</p>
                        <p className="text-zinc-500 mt-0.5">{sessionInSlot.time}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </StatCard>
    </div>
  );
}
