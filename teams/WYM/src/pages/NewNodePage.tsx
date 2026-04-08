import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Box, Circle, Star, CloudLightning, Atom, Orbit, CheckCircle2, Save } from 'lucide-react';
import { useNodeStore } from '../store/useNodeStore';
import { GlowButton } from '../components/ui/GlowButton';

const iconOptions = [
  { value: 'Circle', icon: Circle },
  { value: 'Star', icon: Star },
  { value: 'CloudLightning', icon: CloudLightning },
  { value: 'Atom', icon: Atom },
  { value: 'Orbit', icon: Orbit },
];

const statusOptions = [
  { value: 'locked', label: 'Locked' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function NewNodePage() {
  const navigate = useNavigate();
  const addNode = useNodeStore((s) => s.addNode);
  const existingNodes = useNodeStore((s) => s.nodes);

  const [label, setLabel] = useState('');
  const [parentId, setParentId] = useState('');
  const [icon, setIcon] = useState('Circle');
  const [status, setStatus] = useState<'locked' | 'active' | 'completed'>('locked');
  const [color, setColor] = useState('#a882ff'); // Default accent color

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    // Center spawn coordinates
    addNode(
      {
        label,
        icon,
        status,
        color,
        x: 350,
        y: 200,
      },
      parentId ? parentId : undefined
    );

    // Navigate back to the visual syllabus map
    navigate('/syllabus');
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/syllabus"
          className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Box size={20} className="text-[#a882ff]" />
            Construct Node
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Inject a new knowledge node into the timeline syllabus.
          </p>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Node Label */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Node Label (Subject)
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Advanced String Theory"
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors"
            />
          </div>

          {/* Connect to Parent Node */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Connect to Existing Node (Optional)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">-- No Connection (Floating Node) --</option>
              {existingNodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.label}
                </option>
              ))}
            </select>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Visual Glyph (Icon)
            </label>
            <div className="flex items-center gap-3">
              {iconOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = icon === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIcon(opt.value)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#a882ff]/20 border-2 border-[#a882ff] text-[#a882ff]'
                        : 'bg-[#18181b] border border-zinc-800 text-zinc-500 hover:border-zinc-600'
                    }`}
                  >
                    <IconComponent size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Initial Status
            </label>
            <div className="flex gap-4">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value as any)}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center gap-2 border transition-colors cursor-pointer ${
                    status === opt.value
                      ? 'border-[#34d399] bg-[#34d399]/10 text-[#34d399]'
                      : 'border-zinc-800 bg-[#18181b] text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {status === opt.value && <CheckCircle2 size={16} />}
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color (Optional) */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Accent Color
            </label>
            <div className="flex items-center gap-4">
              {['#a882ff', '#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#f87171'].map(
                (hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => setColor(hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                      color === hex
                        ? 'border-white scale-110 shadow-lg'
                        : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                )
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800/50 flex justify-end">
             <GlowButton type="submit" variant="primary" icon={<Save size={16} />}>
               Save Node
             </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
