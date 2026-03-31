import React from 'react';
import { Gavel, Briefcase, Users, ChevronRight } from 'lucide-react';
import type { UserRole } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: (role: UserRole) => void;
}> = ({ role, title, description, icon, onSelect }) => (
  <button
    onClick={() => onSelect(role)}
    className="group relative w-full text-left p-6 glass border border-theme-border rounded-2xl shadow-premium hover:shadow-premium-lg hover:border-[var(--primary)] transition-all duration-300 overflow-hidden"
    style={{ backgroundColor: 'var(--card)' }}
  >
    <div className="flex items-center relative z-10">
      <div className="p-4 bg-[var(--secondary)] text-[var(--primary)] rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="ml-6">
        <h3 className="text-xl font-bold text-theme-foreground group-hover:text-[var(--primary)] transition-colors">{title}</h3>
        <p className="text-sm text-theme-muted mt-1.5 leading-relaxed">{description}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
        <ChevronRight className="h-6 w-6 text-[var(--primary)]" />
      </div>
    </div>
  </button>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const t = useTranslations();
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-theme-background text-theme-foreground">
      {/* Background Decorative Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[var(--primary)] opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--accent)] opacity-10 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-2xl mx-auto z-10 space-y-12">
        <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-4 bg-theme-card rounded-2xl shadow-premium border border-theme-border">
              <Gavel className="h-10 w-10 text-[var(--primary)]" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-theme-foreground">
              Justice at <span className="text-[var(--primary)]">Fingertips</span>
            </h1>
            <p className="text-lg text-theme-muted max-w-lg mx-auto leading-relaxed">
              {t.login.subtitle}
            </p>
        </div>
        
        <div className="grid gap-6">
            <RoleCard
              role="citizen"
              title={t.login.citizenTitle}
              description={t.login.citizenDescription}
              icon={<Users className="h-7 w-7" />}
              onSelect={onLogin}
            />
            <RoleCard
              role="advocate"
              title={t.login.advocateTitle}
              description={t.login.advocateDescription}
              icon={<Briefcase className="h-7 w-7" />}
              onSelect={onLogin}
            />
            <RoleCard
              role="judge"
              title={t.login.judgeTitle}
              description={t.login.judgeDescription}
              icon={<Gavel className="h-7 w-7" />}
              onSelect={onLogin}
            />
        </div>

        <div className="text-center pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-theme-card rounded-full border border-theme-border">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-theme-muted">
              {t.login.compliance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};