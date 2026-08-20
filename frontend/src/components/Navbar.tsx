import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Shield, User, LogOut, Menu, X, LayoutDashboard, Search, ChevronRight } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../context/AuthContext';
import { LoginModal } from './LoginModal';

export const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isStaff = user && ['EMPLOYEE', 'GP_ADMIN', 'SUPER_ADMIN'].includes(user.role);

  const mainNavItems = [
    { path: '/', label: 'मुख्यपृष्ठ' },
    { path: '/gp-info', label: 'आमची ग्राम पंचायत' },
    { path: '/village-info', label: 'आमचे गाव' },
    { path: '/schemes', label: 'योजना आणि प्रकल्प' },
    { path: '/services', label: 'नागरिक सेवा' },
    { path: '/complaints', label: 'तक्रार निवारण' },
    { path: '/taxes', label: 'कर भरणा' },
    { path: '/development', label: 'गाव विकास डॅशबोर्ड' },
    { path: '/contacts', label: 'संपर्क' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
        {/* Topmost Government Header Strip (Deep Maroon #881337) */}
        <div className="bg-[#881337] text-white px-4 sm:px-8 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🇮🇳</span>
            <span>Government of India / महाराष्ट्र शासन</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[11px] text-maroon-200">
              Skip to Main Content
            </span>
            {/* Trilingual Switcher */}
            <LanguageSwitcher variant="dark" />

            {/* Admin Dashboard Shortcut if Staff */}
            {isStaff && (
              <Link
                to="/admin"
                className="px-2.5 py-0.5 bg-amber-400 text-maroon-950 font-bold rounded text-[11px] hover:bg-amber-300 transition-colors flex items-center gap-1"
              >
                <LayoutDashboard className="w-3 h-3" />
                {t('nav.admin')}
              </Link>
            )}
          </div>
        </div>

        {/* Main White Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-full bg-maroon-850 p-0.5 shadow-md flex items-center justify-center text-white font-extrabold text-xl">
              🏢
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold leading-tight text-maroon-850 tracking-tight flex items-center gap-2">
                ग्रामपंचायत लोंढवे
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold">
                ता. अमळनेर, जि. जळगाव, महाराष्ट्र
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'text-maroon-850 border-b-2 border-maroon-850 font-extrabold'
                      : 'text-slate-700 hover:text-maroon-850 hover:bg-maroon-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 p-1 pl-3 rounded-full border border-slate-200">
                <Link to="/profile" className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-maroon-850 text-white flex items-center justify-center text-xs font-bold">
                    {user.name[0]}
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 bg-maroon-850 hover:bg-maroon-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 p-4 space-y-2 animate-fadeIn">
            {isStaff && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 bg-amber-400 text-maroon-950 font-bold text-xs rounded-xl shadow-md"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  {t('nav.admin')}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
            <div className="grid grid-cols-1 gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                    location.pathname === item.path
                      ? 'bg-maroon-850 text-white'
                      : 'bg-slate-50 text-slate-800 hover:bg-maroon-50'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
