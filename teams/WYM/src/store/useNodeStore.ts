import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyllabusNode, NodeConnection } from '../types';
import { syllabusNodes, syllabusConnections } from '../data/syllabusData';

/* ──────────────────────────────────────────────────────────
   Node Store — Manages syllabus node positions & drag state
   ────────────────────────────────────────────────────────── */

interface NodeState {
  nodes: SyllabusNode[];
  connections: NodeConnection[];
  draggedNodeId: string | null;
  dragOffset: { x: number; y: number };
  isMapPanning: boolean;
  isFullscreen: boolean;
  isSearchOpen: boolean;
  searchQuery: string;
  isLinkingMode: boolean;
  selectedLinkingNodeId: string | null;

  startDrag: (id: string, offsetX: number, offsetY: number) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  panMap: (dx: number, dy: number) => void;
  endDrag: () => void;
  toggleNodeStatus: (id: string) => void;
  addNode: (node: Omit<SyllabusNode, 'id'>, parentId?: string) => void;
  removeNode: (id: string) => void;
  toggleLinkingMode: () => void;
  executeLink: (targetId: string) => void;
  setFullscreen: (value: boolean) => void;
  setMapPanning: (value: boolean) => void;
  toggleFullscreen: () => void;
  setSearchOpen: (value: boolean) => void;
  toggleSearchOpen: () => void;
  setSearchQuery: (query: string) => void;
}

export const useNodeStore = create<NodeState>()(
  persist(
    (set, get) => ({
  nodes: syllabusNodes,
  connections: syllabusConnections,
  draggedNodeId: null,
  dragOffset: { x: 0, y: 0 },
  isMapPanning: false,
  isFullscreen: false,
  isSearchOpen: false,
  searchQuery: '',
  isLinkingMode: false,
  selectedLinkingNodeId: null,

  startDrag: (id, offsetX, offsetY) => {
    set({ draggedNodeId: id, dragOffset: { x: offsetX, y: offsetY } });
  },

  updateNodePosition: (id, x, y) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id ? { ...n, x, y } : n
      ),
    }));
  },

  panMap: (dx, dy) => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({
        ...n,
        x: n.x + dx,
        y: n.y + dy,
      })),
    }));
  },

  endDrag: () => {
    set({ draggedNodeId: null, dragOffset: { x: 0, y: 0 } });
  },

  toggleNodeStatus: (id) => {
    set((state) => ({
      nodes: state.nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              status:
                n.status === 'completed'
                  ? 'active'
                  : n.status === 'active'
                    ? 'completed'
                    : 'active', // Allow clicking locked nodes to become active
            }
          : n
      ),
    }));
  },

  addNode: (node, parentId) => {
    set((state) => {
      const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newConnection = parentId ? { from: parentId, to: newId } : null;
      
      return {
        nodes: [
          ...state.nodes,
          {
            ...node,
            id: newId,
          },
        ],
        connections: newConnection
          ? [...state.connections, newConnection]
          : state.connections,
      };
    });
  },

  removeNode: (id) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      connections: state.connections.filter((c) => c.from !== id && c.to !== id),
      selectedLinkingNodeId: state.selectedLinkingNodeId === id ? null : state.selectedLinkingNodeId,
    }));
  },

  toggleLinkingMode: () => {
    set((state) => ({
      isLinkingMode: !state.isLinkingMode,
      selectedLinkingNodeId: null,
    }));
  },

  executeLink: (targetId) => {
    const state = get();
    const sourceId = state.selectedLinkingNodeId;

    if (!sourceId || sourceId === targetId) {
      // First click: select this as the source
      set({ selectedLinkingNodeId: targetId });
      return;
    }

    // Second click: create or remove the connection (toggle)
    const alreadyExists = state.connections.some(
      (c) => (c.from === sourceId && c.to === targetId) || (c.from === targetId && c.to === sourceId)
    );

    set({
      connections: alreadyExists
        ? state.connections.filter(
            (c) => !((c.from === sourceId && c.to === targetId) || (c.from === targetId && c.to === sourceId))
          )
        : [...state.connections, { from: sourceId, to: targetId }],
      selectedLinkingNodeId: null, // Reset after linking
    });
  },

  setFullscreen: (value) => set({ isFullscreen: value }),
  setMapPanning: (value) => set({ isMapPanning: value }),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
  setSearchOpen: (value) => set({ isSearchOpen: value }),
  toggleSearchOpen: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'node-storage',
    }
  )
);
