import { memo, type ReactNode } from 'react';

/* ──────────────────────────────────────────────────────────
   StatCard — Reusable dark-glass card container
   ────────────────────────────────────────────────────────── */

interface StatCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

function StatCardComponent({ children, className = '', glow = false }: StatCardProps) {
  return (
    <div
      className={`
        bg-[#121214] border border-zinc-800/50 rounded-2xl p-6 xl:p-7
        transition-all duration-300
        ${glow ? 'shadow-[0_0_30px_rgba(168,130,255,0.08)] hover:shadow-[0_0_40px_rgba(168,130,255,0.12)]' : ''}
        hover:border-zinc-700/50
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export const StatCard = memo(StatCardComponent);
