import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { ViewType, Theme, UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  handleLogout: () => void;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole, handleLogout, activeView, setActiveView, theme, setTheme }) => {
  return (
    <div className="flex h-screen bg-theme-background text-theme-foreground transition-colors duration-300">
      <Sidebar userRole={userRole} activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} handleLogout={handleLogout} theme={theme} setTheme={setTheme} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-theme-background p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};