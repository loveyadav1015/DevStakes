import { memo } from 'react';
import { Search, Bell, Settings, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useNodeStore } from '../../store/useNodeStore';

/* ──────────────────────────────────────────────────────────
   TopBar — Search, tab navigation, and burnout risk meter
   ────────────────────────────────────────────────────────── */

const tabs = [
  { id: 'timeline', label: 'Timeline', path: '/' },
  { id: 'syllabus', label: 'Syllabus', path: '/syllabus' },
  { id: 'metrics', label: 'Metrics', path: '/analytics' },
];

function TopBarComponent() {
  const burnoutRisk = useCalendarStore((s) => s.burnoutRisk);
  const isRecalculating = useCalendarStore((s) => s.isRecalculating);
  const recalculate = useCalendarStore((s) => s.recalculate);
  const searchQuery = useNodeStore((s) => s.searchQuery);
  const setSearchQuery = useNodeStore((s) => s.setSearchQuery);

  return (
    <header className="flex items-center justify-between h-16 px-8 border-b border-zinc-800/50 bg-[#0e0e11]/80 backdrop-blur-sm sticky top-0 z-40">
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#18181b] rounded-lg px-3 py-2 w-64 border border-zinc-800/50">
          <Search size={14} className="text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search archive nodes..."
            className="bg-transparent text-sm text-zinc-400 placeholder-zinc-600 outline-none w-full"
          />
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1 ml-4">
          {tabs.map(({ id, label, path }) => (
            <NavLink
              key={id}
              to={path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                ${
                  isActive
                    ? 'text-white border-b-2 border-[#a882ff]'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Center: Burnout Risk */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
          Burnout Risk
        </span>
        <div className="w-32 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              burnoutRisk > 60
                ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                : burnoutRisk > 35
                  ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  : 'bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.4)]'
            }`}
            style={{ width: `${burnoutRisk}%` }}
          />
        </div>
        <span className="text-xs font-mono text-zinc-400">{burnoutRisk}%</span>
        <button
          onClick={recalculate}
          disabled={isRecalculating}
          className={`
            ml-2 px-3 py-1 text-[10px] font-mono uppercase tracking-wider
            rounded-md border transition-all duration-300 cursor-pointer
            ${
              isRecalculating
                ? 'border-[#a882ff]/30 text-[#a882ff]/50 bg-[#a882ff]/5 animate-pulse'
                : 'border-zinc-700 text-zinc-400 hover:border-[#a882ff]/50 hover:text-[#a882ff] hover:bg-[#a882ff]/5'
            }
          `}
        >
          {isRecalculating ? '⟳ Recalculating...' : '⚡ Aegis Engine'}
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer">
          <Bell size={18} />
        </button>
        <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors cursor-pointer">
          <Settings size={18} />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a882ff] to-[#7c5cbf] flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
      </div>
    </header>
  );
}

export const TopBar = memo(TopBarComponent);
