import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Grid, Bell, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  // Hide bottom nav in admin dashboard routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const items = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/services', label: t('nav.services'), icon: Grid },
    { path: '/notices', label: t('nav.notices'), icon: Bell },
    { path: '/complaints', label: t('nav.complaints'), icon: AlertCircle },
    { path: '/profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl lg:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                isActive ? 'text-[#881337] font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
              <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
