import React from 'react';
import type { ViewType, UserRole } from '../types';
import { 
  Search, 
  Briefcase, 
  BarChart3, 
  Users, 
  Gavel, 
  FileText, 
  Mail, 
  FlaskConical, 
  History, 
  Feather, 
  Calendar 
} from 'lucide-react';
import { useTranslations } from '../hooks/useTranslations';
import { FEATURE_FLAGS } from '../featureFlags';


interface SidebarProps {
  userRole: UserRole;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

interface NavItemProps {
  view: ViewType;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (view: ViewType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`group w-full flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 relative rounded-xl mb-1 ${
      isActive
        ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg scale-[1.02]'
        : 'text-theme-muted hover:bg-[var(--secondary)] hover:text-theme-foreground'
    }`}
  >
    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </span>
    <span className="ml-3 font-semibold">{label}</span>
  </button>
);

const getNavItemsForRole = (role: UserRole, t: any) => {
    const judgeItems = [
        { view: 'dashboard' as ViewType, label: t.sidebar.judgesDashboard, icon: <Gavel className="h-5 w-5" /> },
        { view: 'analytics' as ViewType, label: t.sidebar.judicialAnalytics, icon: <BarChart3 className="h-5 w-5" /> },
    ];

    const advocateItems = [
        { view: 'dashboard' as ViewType, label: t.advocateNav.caseRequests, icon: <Mail className="h-5 w-5" />, flag: true },
        { view: 'airesearch' as ViewType, label: t.advocateNav.aiResearch, icon: <FlaskConical className="h-5 w-5" />, flag: true },
        { view: 'aidrafts' as ViewType, label: t.advocateNav.aiDrafts, icon: <Feather className="h-5 w-5" />, flag: FEATURE_FLAGS.aiDraftGenerator },
        { view: 'similarcases' as ViewType, label: t.advocateNav.similarCases, icon: <History className="h-5 w-5" />, flag: true },
        { view: 'search' as ViewType, label: t.advocateNav.precedentSearch, icon: <Search className="h-5 w-5" />, flag: true },
        { view: 'builder' as ViewType, label: t.advocateNav.argumentBuilder, icon: <Users className="h-5 w-5" />, flag: true },
        { view: 'calendar' as ViewType, label: t.advocateNav.smartCalendar, icon: <Calendar className="h-5 w-5" />, flag: FEATURE_FLAGS.smartCalendar },
    ].filter(item => item.flag);

    const citizenItems = [
        { view: 'dashboard' as ViewType, label: t.sidebar.citizenDashboard, icon: <Users className="h-5 w-5" /> },
        { view: 'case_filing' as ViewType, label: t.sidebar.caseFiling, icon: <FileText className="h-5 w-5" /> },
    ];
    
    switch (role) {
        case 'judge': return judgeItems;
        case 'advocate': return advocateItems;
        case 'citizen': return citizenItems;
        default: return [];
    }
}


export const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView }) => {
  const t = useTranslations();
  const navItems = getNavItemsForRole(userRole, t);

  return (
    <div className="hidden lg:flex w-72 bg-theme-card border-r border-theme-border flex-col p-6 shadow-premium">
      <div className="flex items-center px-2 mb-10">
        <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center mr-3 shadow-lg">
          <Gavel className="h-6 w-6 text-[var(--primary-foreground)]" />
        </div>
        <h2 className="text-xl font-black tracking-tight text-theme-foreground uppercase italic">
          Justice <span className="text-[var(--primary)]">Hub</span>
        </h2>
      </div>
      <nav className="flex-1">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={setActiveView}
          />
        ))}
      </nav>
       <div className="mt-auto pt-6 border-t border-theme-border">
            <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-theme-border">
              <p className="text-[10px] uppercase tracking-widest font-bold text-theme-muted mb-1">{t.sidebar.compliance}</p>
              <p className="text-xs text-theme-foreground font-medium">Secure AI Environment</p>
            </div>
        </div>
    </div>
  );
};