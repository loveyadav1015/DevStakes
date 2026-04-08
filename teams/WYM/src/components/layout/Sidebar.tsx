import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  BarChart3,
  HelpCircle,
  Archive,
  Plus,
  Briefcase,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { GlowButton } from '../ui/GlowButton';

/* ──────────────────────────────────────────────────────────
   Sidebar — Left navigation panel
   Matches the Kinetic Archive reference design
   ────────────────────────────────────────────────────────── */

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen, path: '/syllabus' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
];

const bottomLinks = [
  { id: 'support', label: 'Support', icon: HelpCircle },
  { id: 'archive', label: 'Archive', icon: Archive },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

function SidebarComponent({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-screen z-50
        flex flex-col
        bg-[#0e0e11] border-r border-zinc-800/50
        transition-all duration-300
        ${collapsed ? 'w-[80px]' : 'w-[240px]'}
      `}
    >
      {/* Logo & Toggle */}
      <div className={`px-6 pt-8 pb-10 flex items-start justify-between ${collapsed ? 'items-center px-0 flex-col gap-5' : 'items-start'}`}>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-base tracking-tight leading-tight">
              Kinetic Archive
            </h1>
            <p className="text-zinc-600 text-[10px] font-mono tracking-widest mt-1">
              V.01 — COMMAND
            </p>
          </div>
        )}
        <button 
          onClick={onToggle}
          className={`text-zinc-500 hover:text-white transition-colors cursor-pointer ${collapsed ? 'mx-auto' : 'mt-0.5'}`}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-200 group
              ${
                isActive
                  ? 'bg-[#a882ff]/10 text-[#a882ff]'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }
              ${collapsed ? 'justify-center border border-transparent' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon
              size={18}
              className="flex-shrink-0 transition-colors duration-200"
            />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Quick Actions (Node / Project) */}
      <div className="px-4 mb-6 flex flex-col gap-2 justify-center">
        {collapsed ? (
          <>
            <button 
              onClick={() => navigate('/syllabus/new')}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a882ff]/20 to-[#7c5cbf]/20 border border-[#a882ff]/30 text-[#a882ff] flex items-center justify-center hover:bg-[#a882ff]/30 transition-colors cursor-pointer"
              title="New Node"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => navigate('/project/new')}
              className="w-12 h-12 rounded-xl bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              title="New Project"
            >
              <Briefcase size={18} />
            </button>
          </>
        ) : (
          <>
            <div className="w-full" onClick={() => navigate('/syllabus/new')}>
              <GlowButton fullWidth icon={<Plus size={16} />}>
                New Node
              </GlowButton>
            </div>
            <button
              onClick={() => navigate('/project/new')}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-medium border border-zinc-700/50 bg-[#18181b] text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Briefcase size={16} />
              New Project
            </button>
          </>
        )}
      </div>

      {/* Bottom Links */}
      <div className="px-4 pb-8 space-y-2">
        {bottomLinks.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm
                       text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50
                       transition-all duration-200 cursor-pointer
                       ${collapsed ? 'justify-center w-full' : 'w-full'}`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </div>
    </aside>
  );
}

export const Sidebar = memo(SidebarComponent);
