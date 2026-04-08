import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Layers, GitBranch, Lock, CheckCircle2, Plus } from 'lucide-react';
import { NodeMap } from '../components/nodemap/NodeMap';
import { StatCard } from '../components/dashboard/StatCard';
import { useNodeStore } from '../store/useNodeStore';

/* ──────────────────────────────────────────────────────────
   Syllabus Page — Full-screen view of the node map
   ────────────────────────────────────────────────────────── */

export default function SyllabusPage() {
  const nodes = useNodeStore((s) => s.nodes);
  const connections = useNodeStore((s) => s.connections);

  const completedNodes = nodes.filter((n) => n.status === 'completed').length;
  const lockedNodes = nodes.filter((n) => n.status === 'locked').length;

  return (
    <div className="animate-fadeIn h-[calc(100vh-5rem)] flex flex-col">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen size={20} className="text-[#a882ff]" />
              Syllabus Navigator
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              Interactive knowledge graph • Drag nodes to reorganize
            </p>
          </div>
        </div>
        <Link
          to="/syllabus/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#18181b] border border-zinc-700/50 hover:bg-zinc-800 hover:border-[#a882ff] rounded-lg text-sm text-zinc-300 hover:text-white transition-all duration-200"
        >
          <Plus size={16} />
          <span>New Node</span>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#a882ff]/10 flex items-center justify-center">
              <Layers size={16} className="text-[#a882ff]" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{nodes.length}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Total Nodes</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#60a5fa]/10 flex items-center justify-center">
              <GitBranch size={16} className="text-[#60a5fa]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#60a5fa]">{connections.length}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Connections</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#34d399]/10 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#34d399]" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#34d399]">{completedNodes}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </StatCard>
        <StatCard>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-700/30 flex items-center justify-center">
              <Lock size={16} className="text-zinc-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-400">{lockedNodes}</p>
              <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">Locked</p>
            </div>
          </div>
        </StatCard>
      </div>

      {/* Full Node Map */}
      <div className="flex-1 min-h-0">
        <NodeMap />
      </div>
    </div>
  );
}
