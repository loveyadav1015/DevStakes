import { memo, useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

/* ──────────────────────────────────────────────────────────
   DashboardLayout — Main application shell
   Fixed sidebar + sticky top bar + content area
   ────────────────────────────────────────────────────────── */

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayoutComponent({ children }: DashboardLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-[#0e0e11] flex overflow-hidden">
      <Sidebar 
        collapsed={isSidebarCollapsed} 
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <div 
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{
          width: `calc(100% - ${isSidebarCollapsed ? '80px' : '240px'})`,
          marginLeft: isSidebarCollapsed ? '80px' : '240px'
        }}
      >
        <TopBar />
        <main className="flex-1 flex flex-col overflow-y-auto p-8 lg:p-10">
          <div className="max-w-[1920px] mx-auto w-full flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export const DashboardLayout = memo(DashboardLayoutComponent);
