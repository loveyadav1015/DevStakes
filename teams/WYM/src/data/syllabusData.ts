import type { SyllabusNode, NodeConnection } from '../types';

/* ──────────────────────────────────────────────────────────
   Mock Syllabus Node Map Data — Cosmic Fundamentals
   ────────────────────────────────────────────────────────── */

export const syllabusNodes: SyllabusNode[] = [
  {
    id: 'node-001',
    label: 'BLACK HOLES',
    icon: 'Circle',
    x: 380,
    y: 140,
    status: 'active',
    color: '#34d399',
  },
  {
    id: 'node-002',
    label: 'ASTROPHYSICS',
    icon: 'Star',
    x: 260,
    y: 260,
    status: 'active',
    color: '#60a5fa',
  },
  {
    id: 'node-003',
    label: 'DARK MATTER',
    icon: 'CloudLightning',
    x: 140,
    y: 380,
    status: 'active',
    color: '#a882ff',
  },
  {
    id: 'node-004',
    label: 'QUANTUM FIELD',
    icon: 'Atom',
    x: 400,
    y: 380,
    status: 'locked',
    color: '#f472b6',
  },
  {
    id: 'node-005',
    label: 'RELATIVITY',
    icon: 'Orbit',
    x: 100,
    y: 160,
    status: 'completed',
    color: '#34d399',
  },
];

export const syllabusConnections: NodeConnection[] = [
  { from: 'node-005', to: 'node-001' },
  { from: 'node-001', to: 'node-002' },
  { from: 'node-002', to: 'node-003' },
  { from: 'node-002', to: 'node-004' },
  { from: 'node-005', to: 'node-003' },
];
