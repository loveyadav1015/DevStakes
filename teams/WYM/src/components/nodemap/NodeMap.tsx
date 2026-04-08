import { memo, useCallback, useRef } from 'react';
import { Maximize2, Search, ChevronDown, ChevronUp, Link2 } from 'lucide-react';
import { useNodeStore } from '../../store/useNodeStore';
import { NodeCircle } from './NodeCircle';
import { NodeConnectionLine } from './NodeConnection';

/* ──────────────────────────────────────────────────────────
   NodeMap — Interactive syllabus node map canvas
   
   Core Implementation:
   - Custom pointer-event drag engine (NOT HTML5 drag-and-drop)
   - SVG connections recalculate in real-time during drag
   - onPointerDown on nodes → capture + track delta
   - onPointerMove on canvas → update position via Zustand
   - onPointerUp on canvas → release
   ────────────────────────────────────────────────────────── */

function NodeMapComponent() {
  const nodes = useNodeStore((s) => s.nodes);
  const connections = useNodeStore((s) => s.connections);
  const draggedNodeId = useNodeStore((s) => s.draggedNodeId);
  const dragOffset = useNodeStore((s) => s.dragOffset);
  const updateNodePosition = useNodeStore((s) => s.updateNodePosition);
  const panMap = useNodeStore((s) => s.panMap);
  const endDrag = useNodeStore((s) => s.endDrag);
  const setMapPanning = useNodeStore((s) => s.setMapPanning);
  const isFullscreen = useNodeStore((s) => s.isFullscreen);
  const toggleFullscreen = useNodeStore((s) => s.toggleFullscreen);
  const isSearchOpen = useNodeStore((s) => s.isSearchOpen);
  const toggleSearchOpen = useNodeStore((s) => s.toggleSearchOpen);
  const searchQuery = useNodeStore((s) => s.searchQuery);
  const setSearchQuery = useNodeStore((s) => s.setSearchQuery);
  const isLinkingMode = useNodeStore((s) => s.isLinkingMode);
  const selectedLinkingNodeId = useNodeStore((s) => s.selectedLinkingNodeId);
  const toggleLinkingMode = useNodeStore((s) => s.toggleLinkingMode);
  const selectedLinkingNode = nodes.find(n => n.id === selectedLinkingNodeId);

  const canvasRef = useRef<HTMLDivElement>(null);
  const mapDragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target !== canvasRef.current) return;
    mapDragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
    setMapPanning(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [setMapPanning]);

  // Handle pointer move on the entire canvas for smooth dragging
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (draggedNodeId && canvasRef.current) {
        // Clamp within canvas bounds
        const rect = canvasRef.current.getBoundingClientRect();
        const clampedX = Math.max(0, Math.min(rect.width - 76, e.clientX - dragOffset.x));
        const clampedY = Math.max(0, Math.min(rect.height - 76, e.clientY - dragOffset.y));

        updateNodePosition(draggedNodeId, clampedX, clampedY);
      } else if (mapDragRef.current.active) {
        const dx = e.clientX - mapDragRef.current.lastX;
        const dy = e.clientY - mapDragRef.current.lastY;
        mapDragRef.current.lastX = e.clientX;
        mapDragRef.current.lastY = e.clientY;
        panMap(dx, dy);
      }
    },
    [draggedNodeId, dragOffset, updateNodePosition, panMap]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (draggedNodeId) {
      endDrag();
    }
    if (mapDragRef.current.active) {
      mapDragRef.current.active = false;
      setMapPanning(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  }, [draggedNodeId, endDrag, setMapPanning]);

  // Look up node objects for each connection
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div
      className={`flex flex-col bg-[#121214] border border-zinc-800/50 overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 !rounded-none h-screen'
          : 'h-full rounded-2xl'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 xl:px-7 pt-5 pb-4">
        <div>
          <h2 className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">
            Syllabus Node Map
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">Cosmic Fundamentals</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isSearchOpen && (
            <input
              type="text"
              autoFocus
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#18181b] border border-zinc-800 rounded-md px-2 py-1 text-xs text-white outline-none w-32 focus:border-[#a882ff]/50 transition-colors"
            />
          )}
          <button
            onClick={toggleSearchOpen}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isSearchOpen
                ? 'text-[#a882ff] bg-[#a882ff]/10'
                : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            <Search size={14} />
          </button>
          <button
              onClick={toggleLinkingMode}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isLinkingMode
                  ? 'text-[#34d399] bg-[#34d399]/10'
                  : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50'
              }`}
              title={isLinkingMode ? 'Exit Link Mode' : 'Enter Link Mode'}
            >
              <Link2 size={14} />
            </button>
            <button
            onClick={toggleFullscreen}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isFullscreen
                ? 'text-[#a882ff] bg-[#a882ff]/10'
                : 'text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/50'
            }`}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`relative flex-1 overflow-hidden transition-all duration-300 ${
          isLinkingMode ? 'ring-2 ring-[#34d399]/30 ring-inset' : ''
        }`}
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(168,130,255,0.03) 0%, transparent 70%),
            radial-gradient(circle at 80% 20%, rgba(52,211,153,0.02) 0%, transparent 50%),
            #0e0e11
          `,
          touchAction: 'none',
          cursor: mapDragRef.current?.active ? 'grabbing' : 'grab',
        }}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Link Mode Indicator Banner */}
        {isLinkingMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-[#34d399]/10 border border-[#34d399]/30 rounded-full backdrop-blur-sm">
            <p className="text-[10px] font-mono text-[#34d399] uppercase tracking-wider">
              {selectedLinkingNode
                ? `Source: ${selectedLinkingNode.label} — Click target to link`
                : 'Link Mode · Click a node to start — Right-click to delete'}
            </p>
          </div>
        )}

        {/* SVG Connections layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {connections.map((conn) => {
            const fromNode = nodeMap.get(conn.from);
            const toNode = nodeMap.get(conn.to);
            if (!fromNode || !toNode) return null;
            return (
              <NodeConnectionLine
                key={`${conn.from}-${conn.to}`}
                fromNode={fromNode}
                toNode={toNode}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <NodeCircle key={node.id} node={node} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 xl:px-7 py-4 border-t border-zinc-800/30 relative">
        <div className="flex items-center -space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#a882ff] to-[#7c5cbf] border-2 border-[#121214]" />
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#3b82f6] border-2 border-[#121214]" />
        </div>

        {/* Pan Controls */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button 
            onClick={() => panMap(0, 250)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-700/50 bg-[#18181b]/50 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
            title="Pan Map Up"
          >
            <ChevronUp size={14} />
          </button>
          <button 
            onClick={() => panMap(0, -250)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-700/50 bg-[#18181b]/50 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-all duration-200 cursor-pointer"
            title="Pan Map Down"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <span className="text-[10px] font-mono text-zinc-600 tracking-wider">
          + 3 Active Researchers
        </span>
      </div>
    </div>
  );
}

export const NodeMap = memo(NodeMapComponent);
