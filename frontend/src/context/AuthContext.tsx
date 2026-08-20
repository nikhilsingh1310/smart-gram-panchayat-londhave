import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { apiFetch } from '../services/api';
import i18n from '../i18n';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  language: 'en' | 'mr' | 'hi';
  loginCitizenOTP: (mobile: string, code: string, name?: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setLanguage: (lang: 'en' | 'mr' | 'hi') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('londhave_token'));
  const [loading, setLoading] = useState(true);
  const [language, setLanguageState] = useState<'en' | 'mr' | 'hi'>(
    (localStorage.getItem('i18nextLng') as 'en' | 'mr' | 'hi') || 'mr'
  );

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch('/auth/me');
        if (res.success) {
          setUser(res.user);
          if (res.user.preferredLang) {
            const userLang = res.user.preferredLang as 'en' | 'mr' | 'hi';
            i18n.changeLanguage(userLang);
            setLanguageState(userLang);
            localStorage.setItem('i18nextLng', userLang);
          }
        }
      } catch (err) {
        console.error('Failed to load user session:', err);
        localStorage.removeItem('londhave_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const loginCitizenOTP = async (mobile: string, code: string, name?: string) => {
    const res = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ mobile, code, name })
    });

    if (res.success) {
      localStorage.setItem('londhave_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.preferredLang) {
        const userLang = res.user.preferredLang as 'en' | 'mr' | 'hi';
        i18n.changeLanguage(userLang);
        setLanguageState(userLang);
        localStorage.setItem('i18nextLng', userLang);
      }
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    const res = await apiFetch('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    if (res.success) {
      localStorage.setItem('londhave_token', res.token);
      setToken(res.token);
      setUser(res.user);
      if (res.user.preferredLang) {
        const userLang = res.user.preferredLang as 'en' | 'mr' | 'hi';
        i18n.changeLanguage(userLang);
        setLanguageState(userLang);
        localStorage.setItem('i18nextLng', userLang);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('londhave_token');
    setToken(null);
    setUser(null);
  };

  const setLanguage = (lang: 'en' | 'mr' | 'hi') => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setLanguageState(lang);
    if (user && token) {
      apiFetch('/auth/language', {
        method: 'POST',
        body: JSON.stringify({ lang })
      }).catch(console.error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, language, loginCitizenOTP, loginAdmin, logout, setLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
