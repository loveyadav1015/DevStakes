/* ──────────────────────────────────────────────────────────
   Aegis: Kinetic Archive — Type Definitions
   ────────────────────────────────────────────────────────── */

/** A single study session in the calendar/timeline */
export interface Session {
  id: string;
  title: string;
  description: string;
  time: string;         // e.g. "10:00"
  timeEnd?: string;     // e.g. "11:30"
  priority: 'high' | 'medium' | 'low';
  status: 'upcoming' | 'active' | 'completed' | 'missed';
  subject: string;
  sessionNumber?: number;
}

/** A node on the syllabus map */
export interface SyllabusNode {
  id: string;
  label: string;
  icon: string;           // Lucide icon name
  x: number;
  y: number;
  status: 'active' | 'completed' | 'locked';
  color?: string;
}

/** A visual connection between two syllabus nodes */
export interface NodeConnection {
  from: string;
  to: string;
}

/** Navigation item for the sidebar */
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

/** Performance metric displayed on dashboard */
export interface Metric {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'stable';
}

/** Daily focus session details */
export interface DailyFocus {
  subject: string;
  session: string;
  timeStart: string;
  timeEnd: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

/** API-ready schedule payload (for future FastAPI integration) */
export interface SchedulePayload {
  userId: string;
  sessions: Session[];
  burnoutRisk: number;
  recalculateAt?: string;
}

/** API-ready node map payload (for future ML integration) */
export interface SyllabusPayload {
  userId: string;
  nodes: SyllabusNode[];
  connections: NodeConnection[];
}
