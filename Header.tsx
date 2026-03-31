import React, { useState } from 'react';
import { Sun, Moon, Bell } from 'lucide-react';
import type { Theme, UserRole } from '../types';
import { FEATURE_FLAGS } from '../featureFlags';
import { Notifications } from './addons/Notifications';
import { useTranslations } from '../hooks/useTranslations';
import { LanguageSelector } from './LanguageSelector';


interface HeaderProps {
    userRole: UserRole;
    handleLogout: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, handleLogout, theme, setTheme }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const t = useTranslations();
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getRoleTitle = (role: UserRole) => {
        return t.roles[role];
    }

    const getInitials = (role: UserRole) => {
        switch (role) {
            case 'citizen': return 'C';
            case 'advocate': return 'A';
            case 'judge': return 'J';
        }
    }

    return (
        <header className="bg-theme-card text-theme-foreground shadow-premium border-b border-theme-border sticky top-0 z-40">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-lg font-bold text-theme-foreground">{t.header.title}</h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <LanguageSelector />
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-theme-muted hover:bg-[var(--secondary)] hover:text-theme-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                        
                        {FEATURE_FLAGS.realTimeNotifications && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(prev => !prev)}
                                    className="p-2 rounded-full text-theme-muted hover:bg-[var(--secondary)] hover:text-theme-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                                    aria-label="Toggle notifications"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-1 right-1.5 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                </button>
                                {showNotifications && <Notifications onClose={() => setShowNotifications(false)} />}
                            </div>
                        )}

                         <div className="flex items-center space-x-3 pl-4 border-l border-theme-border">
                            <div className="hidden sm:block text-right">
                                <div className="font-bold text-sm text-theme-foreground">{t.header.welcome}</div>
                                <div className="text-xs text-theme-muted">{getRoleTitle(userRole)}</div>
                            </div>
                            <div className="h-9 w-9 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                                {getInitials(userRole)}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            {t.header.logout}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};