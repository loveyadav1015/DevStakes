import { memo, useCallback } from 'react';
import {
  Circle,
  Star,
  CloudLightning,
  Atom,
  Orbit,
  Lock,
} from 'lucide-react';
import type { SyllabusNode } from '../../types';
import { useNodeStore } from '../../store/useNodeStore';

/* ──────────────────────────────────────────────────────────
   NodeCircle — Draggable circular node on the syllabus map
   Uses pointer events instead of HTML5 drag-and-drop
   ────────────────────────────────────────────────────────── */

interface NodeCircleProps {
  node: SyllabusNode;
}

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Circle,
  Star,
  CloudLightning,
  Atom,
  Orbit,
};

const NODE_SIZE = 76; // px

function NodeCircleComponent({ node }: NodeCircleProps) {
  const startDrag = useNodeStore((s) => s.startDrag);
  const draggedNodeId = useNodeStore((s) => s.draggedNodeId);
  const isMapPanning = useNodeStore((s) => s.isMapPanning);
  const toggleNodeStatus = useNodeStore((s) => s.toggleNodeStatus);
  const searchQuery = useNodeStore((s) => s.searchQuery);
  const isLinkingMode = useNodeStore((s) => s.isLinkingMode);
  const selectedLinkingNodeId = useNodeStore((s) => s.selectedLinkingNodeId);
  const executeLink = useNodeStore((s) => s.executeLink);
  const removeNode = useNodeStore((s) => s.removeNode);

  const isDragging = draggedNodeId === node.id;
  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';
  const isMatch = !searchQuery || node.label.toLowerCase().includes(searchQuery.toLowerCase());
  const isLinkSource = isLinkingMode && selectedLinkingNodeId === node.id;

  const IconComponent = iconMap[node.icon] || Circle;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isLinkingMode) {
        // In link mode, don't initiate drag
        e.stopPropagation();
        return;
      }
      // Allow pointer down on locked nodes for unlocking via click, but prevent dragging them
      if (isLocked) {
         e.stopPropagation();
         return;
      }
      e.preventDefault();
      e.stopPropagation();

      // Capture pointer for smooth tracking
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      const offsetX = e.clientX - node.x;
      const offsetY = e.clientY - node.y;
      startDrag(node.id, offsetX, offsetY);
    },
    [node.id, node.x, node.y, startDrag, isLocked, isLinkingMode]
  );

  const handleClick = useCallback(() => {
    if (isLinkingMode) {
      executeLink(node.id);
    } else {
      toggleNodeStatus(node.id);
    }
  }, [isLinkingMode, executeLink, toggleNodeStatus, node.id]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isLinkingMode) {
      e.preventDefault();
      removeNode(node.id);
    }
  }, [isLinkingMode, removeNode, node.id]);

  return (
    <div
      className={`
        absolute flex flex-col items-center gap-1.5 select-none
        ${isDragging || isMapPanning ? '' : 'transition-all duration-300'}
        ${isDragging ? 'z-50' : 'z-10'}
        ${isDragging ? 'cursor-grabbing' : isLinkingMode ? 'cursor-crosshair' : 'cursor-pointer'}
        ${!isMatch ? 'opacity-20 grayscale scale-95 pointer-events-none' : 'opacity-100'}
      `}
      style={{
        left: node.x,
        top: node.y,
        width: NODE_SIZE,
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {/* Circle */}
      <div
        className={`
          w-[${NODE_SIZE}px] h-[${NODE_SIZE}px] rounded-full
          flex items-center justify-center
          border-2 transition-all duration-300
          ${
            isLinkSource
              ? 'border-[#34d399] shadow-[0_0_25px_rgba(52,211,153,0.5)] scale-110 animate-pulse'
              : isDragging
                ? 'border-[#a882ff] shadow-[0_0_30px_rgba(168,130,255,0.4)] scale-110'
                : isCompleted
                  ? 'border-[#34d399]/50 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                  : isLocked
                    ? 'border-zinc-700/30 opacity-50'
                    : isLinkingMode
                      ? 'border-zinc-600 hover:border-[#34d399]/60 hover:shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                      : 'border-zinc-700/50 hover:border-[#a882ff]/40 hover:shadow-[0_0_20px_rgba(168,130,255,0.15)]'
          }
          bg-[#18181b]
        `}
        style={{ width: NODE_SIZE, height: NODE_SIZE }}
      >
        {isLocked ? (
          <Lock size={18} className="text-zinc-600" />
        ) : (
          <IconComponent
            size={20}
            className={isCompleted ? 'text-[#34d399]' : 'text-zinc-400'}
            style={{ color: isCompleted ? '#34d399' : node.color }}
          />
        )}
      </div>

      {/* Label */}
      <span
        className={`
          text-[9px] font-mono uppercase tracking-[0.15em] text-center leading-tight
          max-w-[80px]
          ${isLocked ? 'text-zinc-700' : isCompleted ? 'text-[#34d399]/70' : 'text-zinc-500'}
        `}
      >
        {node.label}
      </span>
    </div>
  );
}

export const NodeCircle = memo(NodeCircleComponent);
