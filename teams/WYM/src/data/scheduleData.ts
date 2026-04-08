import type { Session, DailyFocus } from '../types';

/* ──────────────────────────────────────────────────────────
   Mock Schedule Data — Aegis Kinetic Archive
   
   This file simulates what the FastAPI backend + Scikit-Learn
   scheduling engine would return. Structure is API-ready.
   ────────────────────────────────────────────────────────── */

export const todaySessions: Session[] = [
  {
    id: 'sess-001',
    title: 'Advanced Typography',
    description: 'System-wide grid logic and variable font weight optimization.',
    time: '10:00',
    timeEnd: '11:30',
    priority: 'high',
    status: 'upcoming',
    subject: 'Design Systems',
    sessionNumber: 3,
  },
  {
    id: 'sess-002',
    title: 'Neural Architecture',
    description: 'Mapping synaptic pathways in generative design systems.',
    time: '13:30',
    timeEnd: '15:00',
    priority: 'medium',
    status: 'upcoming',
    subject: 'AI Fundamentals',
    sessionNumber: 7,
  },
  {
    id: 'sess-003',
    title: 'System Maintenance',
    description: 'Archive cleaning and node optimization cycles.',
    time: '16:00',
    timeEnd: '17:00',
    priority: 'low',
    status: 'upcoming',
    subject: 'Operations',
    sessionNumber: 2,
  },
  {
    id: 'sess-004',
    title: 'Quantum Physics',
    description: 'Particle entanglement theory and wave function collapse.',
    time: '18:00',
    timeEnd: '19:30',
    priority: 'high',
    status: 'upcoming',
    subject: 'Physics',
    sessionNumber: 4,
  },
  {
    id: 'sess-005',
    title: 'Data Structures',
    description: 'B-trees, red-black trees, and skip list implementations.',
    time: '20:00',
    timeEnd: '21:00',
    priority: 'medium',
    status: 'upcoming',
    subject: 'Computer Science',
    sessionNumber: 12,
  },
];

export const dailyFocus: DailyFocus = {
  subject: 'Quantum Physics',
  session: 'Session 04: Particle Entanglement',
  timeStart: '14:00',
  timeEnd: '15:30',
  priority: 'high',
  icon: 'Atom',
};

/** Backup sessions used when recalculating after a missed session */
export const backupSessions: Session[] = [
  {
    id: 'sess-backup-001',
    title: 'Review: Typography Basics',
    description: 'Condensed review of missed typography fundamentals.',
    time: '17:30',
    timeEnd: '18:00',
    priority: 'medium',
    status: 'upcoming',
    subject: 'Design Systems',
    sessionNumber: 3,
  },
];
