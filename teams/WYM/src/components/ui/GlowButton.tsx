import { memo, type ReactNode, type ButtonHTMLAttributes } from 'react';

/* ──────────────────────────────────────────────────────────
   GlowButton — Neon-accented action button with glow effect
   ────────────────────────────────────────────────────────── */

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  icon?: ReactNode;
}

const variants = {
  primary:
    'bg-[#a882ff] hover:bg-[#b994ff] text-white shadow-[0_0_20px_rgba(168,130,255,0.4)] hover:shadow-[0_0_30px_rgba(168,130,255,0.6)]',
  secondary:
    'bg-[#1e1e23] hover:bg-[#2a2a32] text-zinc-300 border border-zinc-700/50 hover:border-[#a882ff]/30',
  danger:
    'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40',
};

function GlowButtonComponent({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  ...props
}: GlowButtonProps) {
  return (
    <button
      className={`
        relative flex items-center justify-center gap-2
        rounded-xl px-5 py-3 font-semibold text-sm
        transition-all duration-300 ease-out
        cursor-pointer select-none
        active:scale-[0.97]
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}

export const GlowButton = memo(GlowButtonComponent);
