import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Plus, Wand2 } from 'lucide-react';
import { useNodeStore } from '../store/useNodeStore';
import { useCalendarStore } from '../store/useCalendarStore';
import { GlowButton } from '../components/ui/GlowButton';

export default function NewProjectPage() {
  const navigate = useNavigate();
  const addNode = useNodeStore((s) => s.addNode);
  const addSession = useCalendarStore((s) => s.addSession);

  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [startTime, setStartTime] = useState('09:00');
  const [cycle, setCycle] = useState<'daily' | 'weekly'>('daily');
  const [description, setDescription] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Stub function to be replaced by the user's actual API integration
  const handleGenerateDescription = async () => {
    if (!taskName.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // TODO: Replace this timeout with the actual API call
      // Example:
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: JSON.stringify({ taskName, priority })
      // });
      // const data = await response.json();
      // setDescription(data.generatedText);

      await new Promise(resolve => setTimeout(resolve, 1500));
      setDescription(`Generated description for the strategic initialization of: ${taskName}. \n\nThis initiative focuses on establishing core foundations before scaling the operation matrix. Focus required.`);
      
    } catch (error) {
      console.error("Failed to generate description", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    // 1. Create a root project Node in the Syllabus Map
    addNode({
      label: taskName.substring(0, 12), // Abbreviated for node label
      icon: priority === 'high' ? 'Star' : 'Circle',
      status: 'active',
      color: priority === 'high' ? '#f87171' : '#a882ff',
      x: 350,
      y: 200,
    });

    // 2. Draft the opening session for the Calendar Timeline
    // Calculating end time + 1 hr
    const [hours, minutes] = startTime.split(':').map(Number);
    const endRow = new Date();
    endRow.setHours(hours + 1, minutes, 0);
    const endTime = `${String(endRow.getHours()).padStart(2, '0')}:${String(endRow.getMinutes()).padStart(2, '0')}`;

    if (cycle === 'daily') {
      addSession({
        title: taskName,
        description: description || `Kickoff session for ${taskName}`,
        subject: 'Project Kickoff',
        time: startTime,
        timeEnd: endTime,
        priority,
        status: 'upcoming'
      });
    } else {
      // Generate 7 sessions for the entire week
      for (let i = 0; i < 7; i++) {
        addSession({
          title: `${taskName} (Day ${i + 1})`,
          description: description || `Weekly scheduled session for ${taskName}`,
          subject: 'Weekly Routine',
          time: startTime,
          timeEnd: endTime,
          priority,
          status: 'upcoming'
        });
      }
    }

    // Navigate to dashboard where we can view both Syllabus and Calendar!
    navigate('/');
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase size={20} className="text-[#a882ff]" />
            Construct Project
          </h1>
          <p className="text-zinc-500 text-sm mt-0.5">
            Initialize an entirely new macro initiative and schedule its timeline.
          </p>
        </div>
      </div>

      <div className="bg-[#121214] border border-zinc-800/50 rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Project / Task Name */}
          <div>
            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
              Project Task Name
            </label>
            <input
              type="text"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g. Operation Vanguard"
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Timeline Start */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                Timeline Start Hour
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors"
              />
            </div>

            {/* Cycle */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                Project Cycle
              </label>
              <select
                value={cycle}
                onChange={(e) => setCycle(e.target.value as any)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="daily">One-Time (Daily)</option>
                <option value="weekly">Recurring (Weekly)</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2">
                Priority Assignment
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Description Generation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                Generated Description
              </label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={!taskName.trim() || isGenerating}
                className="text-[10px] font-mono bg-[#a882ff]/10 text-[#a882ff] hover:bg-[#a882ff]/20 px-3 py-1.5 rounded disabled:opacity-50 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Wand2 size={12} />
                {isGenerating ? 'Generating...' : 'AI Generate'}
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Will be dynamically populated by AI generation..."
              className="w-full bg-[#18181b] border border-zinc-800 focus:border-[#a882ff] rounded-lg px-4 py-3 text-white outline-none transition-colors resize-none"
            />
          </div>

          <div className="pt-6 border-t border-zinc-800/50 flex justify-end">
             <GlowButton type="submit" variant="primary" icon={<Plus size={16} />}>
               Construct Project
             </GlowButton>
          </div>
        </form>
      </div>
    </div>
  );
}
