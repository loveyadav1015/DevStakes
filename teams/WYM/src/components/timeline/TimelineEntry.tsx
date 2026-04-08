import { memo } from 'react';
import type { Session } from '../../types';
import { PulsingDot } from '../ui/PulsingDot';
import { useCalendarStore } from '../../store/useCalendarStore';
import { useNodeStore } from '../../store/useNodeStore';

/* ──────────────────────────────────────────────────────────
   TimelineEntry — A single session on the temporal log
   Shows time, pulsing dot, title, and description
   ────────────────────────────────────────────────────────── */

interface TimelineEntryProps {
  session: Session;
  isLast: boolean;
  onMiss?: (id: string) => void;
}

function TimelineEntryComponent({ session, isLast, onMiss }: TimelineEntryProps) {
  const markActive = useCalendarStore((s) => s.markActive);
  const completeSession = useCalendarStore((s) => s.completeSession);
  const removeSession = useCalendarStore((s) => s.removeSession);

  const nodes = useNodeStore((s) => s.nodes);
  const removeNode = useNodeStore((s) => s.removeNode);

  const isMissed = session.status === 'missed';
  const isActive = session.status === 'active';
  const isCompleted = session.status === 'completed';

  const removeMatchingNode = (withPrompt: boolean) => {
    // Attempt to match node label and session title robustly
    const associatedNode = nodes.find(
      (n) => session.title.includes(n.label) || n.label.includes(session.title.substring(0, 12))
    );
    
    if (associatedNode) {
      if (withPrompt) {
        if (window.confirm(`Do you also want to permanently delete the associated Syllabus Node: "${associatedNode.label}"?`)) {
          removeNode(associatedNode.id);
        }
      } else {
        removeNode(associatedNode.id);
      }
    }
  };

  const handleComplete = () => {
    completeSession(session.id);
    removeMatchingNode(false);
  };

  const handleMiss = () => {
    if (onMiss) onMiss(session.id);
    removeMatchingNode(true);
  };

  return (
    <div className="flex gap-4 group">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center">
        <PulsingDot status={session.status} size="md" />
        {!isLast && (
          <div className="w-px flex-1 bg-zinc-800/80 mt-1 min-h-[60px]" />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isMissed ? 'opacity-40' : ''}`}>
        {/* Time label */}
        <div className="flex items-center gap-2 mb-1">
          {session.status === 'upcoming' && (
            <span className="text-[10px] font-mono text-[#60a5fa] uppercase tracking-wider">
              Upcoming
            </span>
          )}
          {isActive && (
            <span className="text-[10px] font-mono text-[#a882ff] uppercase tracking-wider animate-pulse">
              Active
            </span>
          )}
          {isMissed && (
            <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider">
              Missed
            </span>
          )}
          <span className="text-[10px] font-mono text-zinc-600">
            • {session.time}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`font-semibold text-base leading-tight mb-1 ${
            isMissed
              ? 'text-zinc-600 line-through'
              : isActive
                ? 'text-[#a882ff]'
                : isCompleted
                  ? 'text-[#34d399]'
                  : 'text-white'
          }`}
        >
          {session.title}
        </h3>

        {/* Description */}
        <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
          {session.description}
        </p>

        {/* Action Buttons */}
        <div className="mt-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {session.status === 'upcoming' && (
            <button
              onClick={() => markActive(session.id)}
              className="text-[10px] font-mono text-[#60a5fa] hover:text-[#93c5fd] uppercase tracking-wider cursor-pointer"
            >
              [Start Session]
            </button>
          )}

          {isActive && (
            <button
              onClick={handleComplete}
              className="text-[10px] font-mono text-[#a882ff] hover:text-[#c4a6ff] uppercase tracking-wider cursor-pointer"
            >
              [Complete]
            </button>
          )}

          {!isMissed && !isCompleted && onMiss && (
            <button
              onClick={handleMiss}
              className="text-[10px] font-mono text-zinc-600 hover:text-red-400 uppercase tracking-wider cursor-pointer"
            >
              [Mark as missed]
            </button>
          )}

          {(isCompleted || isMissed) && (
            <button
              onClick={() => removeSession(session.id)}
              className="text-[10px] font-mono text-red-500/80 hover:text-red-400 uppercase tracking-wider cursor-pointer"
            >
              [Remove Task]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const TimelineEntry = memo(TimelineEntryComponent);
