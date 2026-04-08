import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '../types';
import { todaySessions, backupSessions } from '../data/scheduleData';

/* ──────────────────────────────────────────────────────────
   Calendar Store — Manages timeline sessions & burnout risk
   ────────────────────────────────────────────────────────── */

interface CalendarState {
  sessions: Session[];
  burnoutRisk: number;
  isRecalculating: boolean;
  efficiency: number;
  dayStreak: number;
  peakOutput: string;

  missSession: (id: string) => void;
  recalculate: () => void;
  markActive: (id: string) => void;
  completeSession: (id: string) => void;
  addSession: (session: Omit<Session, 'id'>) => void;
  removeSession: (id: string) => void;
}

/** Finds the hour block with the most completed sessions */
function computePeakOutput(sessions: Session[]): string {
  const completed = sessions.filter(s => s.status === 'completed');
  if (completed.length === 0) return '--:--h';
  
  const hourCounts: Record<string, number> = {};
  completed.forEach(s => {
    const hour = s.time.split(':')[0]; // e.g. '09'
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0];
  return `${peakHour}:00h`;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
  sessions: todaySessions,
  burnoutRisk: 42,
  isRecalculating: false,
  efficiency: 94.2,
  dayStreak: 124,
  peakOutput: '09:14h',

  missSession: (id: string) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, status: 'missed' as const } : s
      ),
      burnoutRisk: Math.min(100, state.burnoutRisk + 12),
    }));
  },

  recalculate: () => {
    set({ isRecalculating: true });

    setTimeout(() => {
      const { sessions } = get();
      const missedSessions = sessions.filter((s) => s.status === 'missed');
      const activeSessions = sessions.filter((s) => s.status !== 'missed');

      const rescheduled = [
        ...activeSessions,
        ...backupSessions.slice(0, missedSessions.length),
      ].sort((a, b) => a.time.localeCompare(b.time));

      set({
        sessions: rescheduled,
        burnoutRisk: Math.max(15, get().burnoutRisk - 20),
        isRecalculating: false,
        efficiency: Math.min(99.9, get().efficiency + 1.5),
      });
    }, 2000);
  },

  markActive: (id: string) => {
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id
          ? { ...s, status: 'active' as const }
          : s
      ),
    }));
  },

  completeSession: (id) => {
    set((state) => {
      const updatedSessions = state.sessions.map((s) =>
        s.id === id ? { ...s, status: 'completed' as const } : s
      );
      return {
        sessions: updatedSessions,
        efficiency: Math.min(100, state.efficiency + 0.5),
        burnoutRisk: Math.max(0, state.burnoutRisk - 5),
        dayStreak: state.dayStreak + 1, // Increment streak on each completion
        peakOutput: computePeakOutput(updatedSessions), // Recompute dynamically
      };
    });
  },

  addSession: (session) => {
    set((state) => {
      const newId = `session-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Calculate a theoretical session Number based on subject
      const subjectSessions = state.sessions.filter(s => s.subject === session.subject);
      const sessionNumber = session.sessionNumber || subjectSessions.length + 1;

      const updatedSessions = [
        ...state.sessions,
        { ...session, id: newId, sessionNumber }
      ].sort((a, b) => a.time.localeCompare(b.time));

      return {
        sessions: updatedSessions,
      };
    });
  },

  removeSession: (id) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    }));
  },
    }),
    {
      name: 'calendar-storage',
    }
  )
);
