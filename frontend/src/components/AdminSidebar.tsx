import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  FileEdit, 
  AlertCircle, 
  Users, 
  BarChart3, 
  BellRing, 
  ShieldCheck, 
  Home,
  LogOut,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { path: '/admin/content', label: t('admin.content_management'), icon: FileEdit },
    { path: '/admin/complaints', label: t('admin.complaint_management'), icon: AlertCircle },
    { path: '/admin/users', label: t('admin.user_management'), icon: Users },
    { path: '/admin/reports', label: t('admin.reports_export'), icon: BarChart3 },
    { path: '/admin/notifications', label: t('admin.notifications'), icon: BellRing },
    { path: '/admin/audit', label: t('admin.audit_logs'), icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Banner */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold">
              GP
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Admin Portal</h2>
              <p className="text-[11px] text-emerald-400 font-medium">Londhave Village</p>
            </div>
          </div>
        </div>

        {/* User Role Tag */}
        {user && (
          <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="block font-semibold text-slate-200 truncate">{user.name}</span>
              <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-950/80 border border-amber-800/60 px-1.5 py-0.5 rounded">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {/* Menu Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-900/40 font-bold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-300" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-1.5 bg-slate-950/40">
          <Link
            to="/"
            className="w-full py-2 px-3 bg-slate-800/80 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Citizen Site View</span>
          </Link>

          <button
            onClick={logout}
            className="w-full py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-red-900/50 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};
