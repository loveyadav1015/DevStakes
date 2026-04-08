import { Link } from 'react-router-dom';
import { BarChart3, ArrowLeft, TrendingUp, Clock, Brain, Flame } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { useCalendarStore } from '../store/useCalendarStore';
import { useNodeStore } from '../store/useNodeStore';

/* ──────────────────────────────────────────────────────────
   Analytics Page — Performance metrics and insights
   ────────────────────────────────────────────────────────── */

export default function AnalyticsPage() {
  const efficiency = useCalendarStore((s) => s.efficiency);
  const dayStreak = useCalendarStore((s) => s.dayStreak);
  const sessions = useCalendarStore((s) => s.sessions);
  const nodes = useNodeStore((s) => s.nodes);

  const completedNodes = nodes.filter((n) => n.status === 'completed').length;

  const effectiveSessions = sessions.filter((s) => s.status !== 'missed');

  const getSessionDurationHours = (session: { time: string; timeEnd?: string }) => {
    if (!session.timeEnd) return 1;
    const [sh, sm] = session.time.split(':').map(Number);
    const [eh, em] = session.timeEnd.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const diff = Math.max(0, endMinutes - startMinutes);
    return diff > 0 ? diff / 60 : 1;
  };

  const totalStudyHours = effectiveSessions.reduce(
    (sum, session) => sum + getSessionDurationHours(session),
    0
  );

  const thisWeekHoursLabel = totalStudyHours > 0 ? `${totalStudyHours.toFixed(1)}h` : '--';

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const weeklyData = weekDays.map((day) => ({ day, hours: 0, sessions: 0 }));

  const sortedSessions = [...effectiveSessions].sort((a, b) => a.time.localeCompare(b.time));

  sortedSessions.forEach((session, index) => {
    const dayIndex = index % weekDays.length;
    const duration = getSessionDurationHours(session);
    weeklyData[dayIndex].hours += duration;
    weeklyData[dayIndex].sessions += 1;
  });

  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);

  const subjectHours = new Map<string, number>();

  sortedSessions.forEach((session) => {
    const duration = getSessionDurationHours(session);
    subjectHours.set(session.subject, (subjectHours.get(session.subject) || 0) + duration);
  });

  const colorPalette = ['#a882ff', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#22c55e', '#38bdf8'];

  const totalSubjectHours = Array.from(subjectHours.values()).reduce((sum, h) => sum + h, 0) || 1;

  const subjects = Array.from(subjectHours.entries()).map(([name, hours], index) => ({
    name,
    percentage: Math.round((hours / totalSubjectHours) * 100),
    color: colorPalette[index % colorPalette.length],
  }));

  return (
    <div className="animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/"
          className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 size={20} className="text-[#a882ff]" />
            Performance Analytics
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Comprehensive learning metrics and insights
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard glow>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#a882ff]/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-[#a882ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{efficiency.toFixed(1)}%</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Efficiency</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#34d399]/10 flex items-center justify-center">
              <Flame size={18} className="text-[#34d399]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#34d399]">{dayStreak}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Day Streak</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/10 flex items-center justify-center">
              <Brain size={18} className="text-[#60a5fa]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#60a5fa]">{completedNodes}/{nodes.length}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Nodes Mastered</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{thisWeekHoursLabel}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">This Week</p>
            </div>
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-5">
        {/* Weekly Activity Chart */}
        <StatCard>
          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-6">
            Weekly Study Hours
          </h3>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((data, i) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-500">{data.hours}h</span>
                <div
                  className="w-full rounded-lg transition-all duration-700 hover:opacity-100 relative group"
                  style={{
                    height: `${(data.hours / maxHours) * 100}%`,
                    background:
                      i === 3
                        ? 'linear-gradient(to top, #a882ff, #c4a6ff)'
                        : 'linear-gradient(to top, #27272a, #3f3f46)',
                    opacity: i === 3 ? 1 : 0.7,
                    boxShadow: i === 3 ? '0 0 15px rgba(168,130,255,0.3)' : 'none',
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.sessions} sessions
                  </div>
                </div>
                <span className="text-[9px] font-mono text-zinc-600 uppercase">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </StatCard>

        {/* Subject Distribution */}
        <StatCard>
          <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-5">
            Subject Distribution
          </h3>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-zinc-300">{subject.name}</span>
                  <span className="text-xs font-mono text-zinc-500">{subject.percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${subject.percentage}%`,
                      backgroundColor: subject.color,
                      boxShadow: `0 0 8px ${subject.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </StatCard>
      </div>

      {/* Session Log */}
      <StatCard className="mt-5">
        <h3 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Recent Session Log
        </h3>
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-[#0e0e11] border border-zinc-800/30 hover:border-zinc-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    session.status === 'completed'
                      ? 'bg-[#34d399]'
                      : session.status === 'missed'
                        ? 'bg-red-500'
                        : session.status === 'active'
                          ? 'bg-[#a882ff]'
                          : 'bg-zinc-600'
                  }`}
                />
                <span className="text-sm text-white">{session.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-zinc-500">{session.time}</span>
                <span
                  className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                    session.status === 'completed'
                      ? 'text-[#34d399] bg-[#34d399]/10'
                      : session.status === 'missed'
                        ? 'text-red-400 bg-red-500/10'
                        : session.status === 'active'
                          ? 'text-[#a882ff] bg-[#a882ff]/10'
                          : 'text-zinc-500 bg-zinc-800/50'
                  }`}
                >
                  {session.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </StatCard>
    </div>
  );
}
